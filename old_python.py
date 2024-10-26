import re
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
import time
import os
import tkinter as tk
from tkinter import messagebox

def load_crm_data(filepath):
    """
    Loads and parses CRM data from a text file.
    Returns a dictionary with the parsed data.
    """
    try:
        with open(filepath, 'r') as file:
            content = file.read()
        
        # Extract key information using regex patterns
        patterns = {
            'first_name': r'First Name:\s*(.+?)(?:\n|$)',
            'last_name': r'Last Name:\s*(.+?)(?:\n|$)',
            'email': r'([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',  # Just the email without label
            'phone': r'P:\s*\(?(\d{3})\)?[-\s]?(\d{3})[-\s]?(\d{4})',     # Updated to match 'P:' format
            'consumption': r'Consumption Kwh:\s*([\d,]+\.?\d*)',
            'production': r'Production kWh:\s*([\d,]+\.?\d*)',
            'site_id': r'Site ID:\s*(\d+)',
            'est_install_date': r'Est Install Date:\s*(\d{4}-\d{2}-\d{2})',
            'postal_code': r'(?:Calgary|Edmonton).*?([A-Z]\d[A-Z]\s?\d[A-Z]\d)'  # Look for postal code after city
        }
        
        data = {}
        for key, pattern in patterns.items():
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                if key == 'phone':
                    # Format phone number without separators
                    data[key] = ''.join(match.groups())
                else:
                    data[key] = match.group(1).strip()
            else:
                print(f"Warning: Could not find match for {key} pattern")
                # Set default values for required fields
                defaults = {
                    'site_id': '123456',
                    'consumption': '12000.00',
                    'production': '10000.00',
                    'postal_code': 'T2H 2A8',
                    'first_name': 'John',
                    'last_name': 'Doe',
                    'email': 'john.doe@example.com',
                    'phone': '4035551234',
                    'est_install_date': datetime.now().strftime('%Y-%m-%d')
                }
                data[key] = defaults.get(key, '')
        
        # Convert the data into the form format
        form_data = {
            # Site ID from CRM
            "site_id": data['site_id'],
            
            # Calculate date offset and day
            "planned_date": calculate_date_params(data['est_install_date']),
            
            # Static site information
            "city": "Calgary",
            "postal_code": data.get('postal_code', 'T2H 2A8'),  # Use extracted postal code with fallback
            
            # Usage and Generation
            "current_energy_consumption": data['consumption'].replace(',', ''),
            "projected_energy_production": data['production'].replace(',', ''),
            "energy_source": "Solar",
            "generator_type": "Synchronous",
            "ac_capacity": "1.23",
            
            # Static document requirements
            "required_documents": [
                "Electrical single-line diagram",
                "Site plan", 
                "Inverter specification",
                "Solar panel specifications",
                "Bidirectional meter installation acknowledgement"
            ],
            "document_path": "my-image.jpg",
            
            # Contact information from CRM
            "contact": {
                "name": f"{data['first_name']} {data['last_name']}",
                "phone": data['phone'],
                "email": data['email'],
                "preferred_method": "email"
            }
        }
        
        return form_data
    
    except Exception as e:
        print(f"Error loading CRM data: {e}")
        raise

def calculate_date_params(date_str):
    """
    Calculates the month offset and day from a date string.
    Returns a dictionary with month_offset and day.
    """
    try:
        target_date = datetime.strptime(date_str, '%Y-%m-%d')
        current_date = datetime.now()
        
        # Calculate months between dates
        month_offset = (target_date.year - current_date.year) * 12 + target_date.month - current_date.month
        if month_offset < 0:
            month_offset = 0
        
        return {
            "month_offset": month_offset,
            "day": target_date.day
        }
    except Exception as e:
        print(f"Error calculating date parameters: {e}")
        return {"month_offset": 3, "day": 15}  # Default fallback

def fill_enmax_form(data):
    # Setup Chrome WebDriver with options
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")
    driver = webdriver.Chrome(options=options)
    wait = WebDriverWait(driver, 10)
    
    def scroll_and_click(element, message=""):
        try:
            if message:
                print(message)
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            time.sleep(.2)
            driver.execute_script("arguments[0].click();", element)
        except Exception as e:
            print(f"Error in scroll_and_click: {e}")
            raise
    
    def log_state(message):
        print(f"Status: {message}")
        try:
            error_messages = driver.find_elements(By.CLASS_NAME, "bg-error-25")
            if error_messages:
                print("Error messages found on page:")
                for error in error_messages:
                    print(f"Error text: {error.text}")
        except:
            pass
    
    try:
        print("Starting form fill process...")
        # Navigate to the page
        driver.get("https://www.enmax.com/helping-power-your-project/start-a-project/connect-a-micro-generator")
        print("Navigated to Enmax page")
        
        # Handle cookie consent
        try:
            cookie_button = wait.until(EC.presence_of_element_located((By.ID, "rcc-confirm-button")))
            driver.execute_script("arguments[0].click();", cookie_button)
            print("Accepted cookies")
        except:
            print("No cookie consent dialog found or already accepted")
        
        # Initial buttons
        unit_owner_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='I am the unit owner']]")))
        scroll_and_click(unit_owner_button, "Clicking 'I am the unit owner'")
        
        understand_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='I understand']]")))
        scroll_and_click(understand_button, "Clicking 'I understand'")
        
        # Enter site ID
        site_id_input = wait.until(EC.presence_of_element_located((By.ID, "site_id")))
        site_id_input.send_keys(data["site_id"])
        
        # Click lookup
        lookup_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Look up']]")))
        scroll_and_click(lookup_button, "Clicking lookup")
        
        # Handle potential errors
        try:
            error_messages = driver.find_elements(By.CLASS_NAME, "bg-error-25")
            for error in error_messages:
                try:
                    close_button = error.find_element(By.TAG_NAME, "button")
                    close_button.click()
                except:
                    driver.execute_script("arguments[0].remove();", error)
        except:
            print("No error messages found")

        # Set the date
        date_field = wait.until(EC.presence_of_element_located(
            (By.XPATH, "//span[contains(@class, 'date-time-input_datetime__value')]")))
        scroll_and_click(date_field, "Opening date picker")
        
        # Click next month button based on data
        for i in range(data["planned_date"]["month_offset"]):
            next_button = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "rdtNext")))
            driver.execute_script("arguments[0].click();", next_button)
            time.sleep(0.2)
        
        # Select day from data
        day_element = wait.until(EC.presence_of_element_located(
            (By.XPATH, f"//td[@data-value='{data['planned_date']['day']}' and contains(@class, 'rdtDay')]")))
        driver.execute_script("arguments[0].click();", day_element)
        log_state("Date selected")
        
        # Initial Questions
        auc_rule_yes = wait.until(EC.element_to_be_clickable((By.ID, "project_has_requirement_metYes")))
        scroll_and_click(auc_rule_yes, "Clicking Yes for AUC Rule")
        
        existing_customer_no = wait.until(EC.element_to_be_clickable(
            (By.ID, "project_is_existing_customerNo")))
        scroll_and_click(existing_customer_no, "Clicking No for existing customer")
        
        continue_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[.//span[text()='Continue']]")))
        scroll_and_click(continue_button, "Clicking Continue")
        
        # Site Information Section
        city_dropdown = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//div[contains(@class, 'dropdown_dropdown__value')]")))
        scroll_and_click(city_dropdown, "Opening city dropdown")
        
        city_option = wait.until(EC.element_to_be_clickable(
            (By.XPATH, f"//div[contains(@class, 'dropdown_dropdown__option') and text()='{data['city']}']")))
        scroll_and_click(city_option, f"Selecting {data['city']}")
        
        postal_code_input = wait.until(EC.presence_of_element_located((By.ID, "postal_code")))
        postal_code_input.send_keys(data["postal_code"])
        
        continue_button = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//div[@id='site-information']//button[.//span[text()='Continue']]")))
        scroll_and_click(continue_button, "Clicking Continue in site information")
        
        # Usage and Generation Section
        consumption_textarea = wait.until(EC.presence_of_element_located((By.ID, "ann_current_energy_consumption")))
        consumption_textarea.clear()
        consumption_textarea.send_keys(data["current_energy_consumption"])
        
        production_input = wait.until(EC.presence_of_element_located((By.ID, "projected_ann_energy_production")))
        production_input.clear()
        production_input.send_keys(data["projected_energy_production"])

        energy_source_dropdown = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//label[contains(text(), 'Energy source of generator')]/..//div[contains(@class, 'dropdown_dropdown__value__')]")))
        scroll_and_click(energy_source_dropdown)

        source_option = wait.until(EC.element_to_be_clickable(
            (By.XPATH, f"//div[contains(@class, 'dropdown_dropdown__option__dhutD') and text()='{data['energy_source']}']")))
        scroll_and_click(source_option)

        generator_radio = wait.until(EC.presence_of_element_located((By.ID, data["generator_type"])))
        scroll_and_click(generator_radio)

        capacity_input = wait.until(EC.presence_of_element_located((By.ID, "current_cap_kw")))
        capacity_input.clear()
        capacity_input.send_keys(data["ac_capacity"])
        
        storage_no = wait.until(EC.element_to_be_clickable((By.ID, "has_energy_storage_unitNo")))
        scroll_and_click(storage_no)
        
        aggregating_no = wait.until(EC.element_to_be_clickable((By.ID, "has_aggregating_multiple_siteNo")))
        scroll_and_click(aggregating_no)
        
        continue_button = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//div[@id='usage-generation']//button[.//span[text()='Continue']]")))
        scroll_and_click(continue_button)

        # Supporting Documents Section
        checkbox_ids = ["document-checkbox-" + str(i) for i in range(len(data["required_documents"]))]
        for checkbox_id in checkbox_ids:
            checkbox = wait.until(EC.presence_of_element_located((By.ID, checkbox_id)))
            scroll_and_click(checkbox)
        
        current_dir = os.path.dirname(os.path.abspath(__file__))
        image_path = os.path.join(current_dir, data["document_path"])
        file_input = wait.until(EC.presence_of_element_located((By.ID, "file")))
        file_input.send_keys(image_path)
        
        continue_button = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//div[@id='supporting-documents']//button[.//span[text()='Continue']]")))
        scroll_and_click(continue_button)
                
        # Compliance Requirements Section
        compliance_ids = {
            "project_has_anti_slandingYes": "anti-islanding",
            "project_has_ul1741_supplement_complyYes": "UL1741",
            "project_has_microgen_wire_requirementYes": "interconnection",
            "compliance_requirement_met_zone_reqsYes": "municipal",
            "compliance_requirement_completed_rule007Yes": "Rule 007",
            "compliance_requirement_completed_rule012Yes": "Rule 012",
            "compliance_requirement_met_env_reqYes": "environmental"
        }
        
        for compliance_id in compliance_ids:
            compliance = wait.until(EC.element_to_be_clickable((By.ID, compliance_id)))
            scroll_and_click(compliance)
        
        objections = wait.until(EC.element_to_be_clickable((By.ID, "compliance_requirement_objectionsNo")))
        scroll_and_click(objections)
        
        final_continue = wait.until(EC.element_to_be_clickable((
            By.XPATH, "//button[contains(@class, 'button--large') and .//span[text()='Continue']]")))
        scroll_and_click(final_continue)
        
        # Contact Information Section
        name_input = wait.until(EC.presence_of_element_located((By.ID, "customer_name")))
        name_input.send_keys(data["contact"]["name"])
        
        phone_input = wait.until(EC.presence_of_element_located((By.ID, "customer_phone")))
        phone_input.send_keys(data["contact"]["phone"])
        
        email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
        email_input.send_keys(data["contact"]["email"])
        
        if data["contact"]["preferred_method"] == "email":
            email_checkbox = wait.until(EC.element_to_be_clickable((By.ID, "preferred-contact-checkbox-0")))
            scroll_and_click(email_checkbox)
        
        continue_button = wait.until(EC.element_to_be_clickable(
            (By.XPATH, "//button[contains(@class, 'button--large') and .//span[text()='Continue']]")))
        scroll_and_click(continue_button)
        
        # Replace the review step with a Tkinter dialog
        def create_exit_dialog():
            root = tk.Tk()
            root.withdraw()  # Hide the main window
            
            def show_summary():
                summary = (
                    f"Current Form Status:\n\n"
                    f"Site ID: {data['site_id']}\n"
                    f"Installation Date: Month +{data['planned_date']['month_offset']}, Day {data['planned_date']['day']}\n"
                    f"Location: {data['city']}, {data['postal_code']}\n"
                    f"Energy Details:\n"
                    f"  - Consumption: {data['current_energy_consumption']} kWh\n"
                    f"  - Production: {data['projected_energy_production']} kWh\n"
                    f"  - Source: {data['energy_source']}\n"
                    f"Contact: {data['contact']['name']} ({data['contact']['email']})"
                )
                messagebox.showinfo("Form Summary", summary)
            
            while True:
                response = messagebox.askquestion(
                    "Form Complete",
                    "Form filling is complete!\n\n"
                    "Would you like to exit?\n\n"
                    "Yes - Exit the program\n"
                    "No - Show form summary",
                    icon='question'
                )
                
                if response == 'yes':
                    print("Exiting...")
                    root.destroy()
                    break
                else:
                    show_summary()
        
        create_exit_dialog()

    except TimeoutException as e:
        print(f"Timeout error: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
        print("Current URL:", driver.current_url)
        try:
            driver.save_screenshot("error_screenshot.png")
            print("Screenshot saved as error_screenshot.png")
        except:
            print("Failed to save screenshot")
    finally:
        driver.quit()

if __name__ == "__main__":
    try:
        # Hardcoded data object
        form_data = {
            # Initial Info
            "site_id": "0020001843127",
            "planned_date": {
                "month_offset": 3,  # Number of months to click forward
                "day": 15
            },
            
            # Site Information
            "city": "Calgary",
            "postal_code": "T2H 2A8",
            
            # Usage and Generation
            "current_energy_consumption": "hello-world",
            "projected_energy_production": "hello-world12345",
            "energy_source": "Solar",
            "generator_type": "Synchronous",
            "ac_capacity": "1.23",
            
            # Documents
            "required_documents": [
                "Electrical single-line diagram",
                "Site plan", 
                "Inverter specification",
                "Solar panel specifications",
                "Bidirectional meter installation acknowledgement"
            ],
            "document_path": "my-image.jpg",
            
            # Contact Information
            "contact": {
                "name": "John Doe",
                "phone": "9999999999",
                "email": "johndoe@trollmail.com",
                "preferred_method": "email"
            }
        }
        
        # crm_data = load_crm_data("crm-data.txt")
        # fill_enmax_form(crm_data)
        fill_enmax_form(form_data)
        
        
    except Exception as e:
        print(f"Error in main execution: {e}")

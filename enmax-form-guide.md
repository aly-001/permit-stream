# Guide to Automating the Enmax Micro-generator Form

## Initial Setup Steps

1. Navigate to the form URL:
```python
driver.get("https://www.enmax.com/helping-power-your-project/start-a-project/connect-a-micro-generator")
```

2. Handle cookie consent popup:
```python
cookie_button = wait.until(EC.presence_of_element_located((By.ID, "rcc-confirm-button")))
driver.execute_script("arguments[0].click();", cookie_button)
```

## Step 1: Initial Form Selection

1. Click "I am the unit owner":
```python
unit_owner_button = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[.//span[text()='I am the unit owner']]")))
scroll_and_click(unit_owner_button)
```

2. Click "I understand":
```python
understand_button = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[.//span[text()='I understand']]")))
scroll_and_click(understand_button)
```

## Step 2: Site ID Entry

1. Enter the site ID:
```python
site_id_input = wait.until(EC.presence_of_element_located((By.ID, "site_id")))
site_id_input.send_keys("0020001843127")
```

2. Click lookup:
```python
lookup_button = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[.//span[text()='Look up']]")))
scroll_and_click(lookup_button)
```

## Step 3: Date Selection

1. Open date picker:
```python
date_field = wait.until(EC.presence_of_element_located(
    (By.XPATH, "//span[contains(@class, 'date-time-input_datetime__value')]")))
scroll_and_click(date_field)
```

2. Navigate to correct month (January 2025):
```python
# Click next month button 3 times
for i in range(3):
    next_button = wait.until(EC.presence_of_element_located((By.CLASS_NAME, "rdtNext")))
    driver.execute_script("arguments[0].click();", next_button)
    time.sleep(0.2)

# Select day 15
day_15 = wait.until(EC.presence_of_element_located(
    (By.XPATH, "//td[@data-value='15' and contains(@class, 'rdtDay')]")))
driver.execute_script("arguments[0].click();", day_15)
```

## Step 4: Initial Questions

1. Select Yes for AUC Rule 024:
```python
auc_rule_yes = wait.until(EC.element_to_be_clickable((By.ID, "project_has_requirement_metYes")))
scroll_and_click(auc_rule_yes)
```

2. Select No for existing customer:
```python
existing_customer_no = wait.until(EC.element_to_be_clickable((By.ID, "project_is_existing_customerNo")))
scroll_and_click(existing_customer_no)
```

3. Click Continue:
```python
continue_button = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//button[.//span[text()='Continue']]")))
scroll_and_click(continue_button)
```

## Step 5: Site Information

1. Select Calgary:
```python
city_dropdown = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[contains(@class, 'dropdown_dropdown__value')]")))
scroll_and_click(city_dropdown)

calgary_option = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[contains(@class, 'dropdown_dropdown__option') and text()='Calgary']")))
scroll_and_click(calgary_option)
```

2. Enter postal code:
```python
postal_code_input = wait.until(EC.presence_of_element_located((By.ID, "postal_code")))
postal_code_input.send_keys("T2H 2A8")
```

## Step 6: Usage and Generation

1. Enter energy consumption:
```python
consumption_textarea = wait.until(EC.presence_of_element_located((By.ID, "ann_current_energy_consumption")))
consumption_textarea.clear()
consumption_textarea.send_keys("hello-world")
```

2. Enter projected production:
```python
production_input = wait.until(EC.presence_of_element_located((By.ID, "projected_ann_energy_production")))
production_input.clear()
production_input.send_keys("hello-world12345")
```

3. Select Solar as energy source:
```python
energy_source_dropdown = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//label[contains(text(), 'Energy source of generator')]/..//div[contains(@class, 'dropdown_dropdown__value__')]")))
scroll_and_click(energy_source_dropdown)

solar_option = wait.until(EC.element_to_be_clickable(
    (By.XPATH, "//div[contains(@class, 'dropdown_dropdown__option__dhutD') and text()='Solar']")))
scroll_and_click(solar_option)
```

4. Select Synchronous generator:
```python
synchronous_radio = wait.until(EC.presence_of_element_located((By.ID, "Synchronous")))
scroll_and_click(synchronous_radio)
```

5. Enter AC capacity:
```python
capacity_input = wait.until(EC.presence_of_element_located((By.ID, "current_cap_kw")))
capacity_input.clear()
capacity_input.send_keys("1.23")
```

6. Answer No to storage and aggregation:
```python
storage_no = wait.until(EC.element_to_be_clickable((By.ID, "has_energy_storage_unitNo")))
scroll_and_click(storage_no)

aggregating_no = wait.until(EC.element_to_be_clickable((By.ID, "has_aggregating_multiple_siteNo")))
scroll_and_click(aggregating_no)
```

## Step 7: Supporting Documents

1. Check all required checkboxes:
```python
checkbox_ids = [
    "document-checkbox-0",  # Electrical single-line diagram
    "document-checkbox-1",  # Site plan
    "document-checkbox-2",  # Inverter specification
    "document-checkbox-3",  # Solar panel specifications
    "document-checkbox-4"   # Bidirectional meter acknowledgement
]

for checkbox_id in checkbox_ids:
    checkbox = wait.until(EC.presence_of_element_located((By.ID, checkbox_id)))
    scroll_and_click(checkbox)
```

2. Upload required image:
```python
current_dir = os.path.dirname(os.path.abspath(__file__))
image_path = os.path.join(current_dir, "my-image.jpg")
file_input = wait.until(EC.presence_of_element_located((By.ID, "file")))
file_input.send_keys(image_path)
```

## Step 8: Compliance Requirements

Click Yes for all compliance questions:
```python
compliance_questions = {
    "project_has_anti_slandingYes": "anti-islanding",
    "project_has_ul1741_supplement_complyYes": "UL1741",
    "project_has_microgen_wire_requirementYes": "interconnection",
    "compliance_requirement_met_zone_reqsYes": "municipal",
    "compliance_requirement_completed_rule007Yes": "Rule 007",
    "compliance_requirement_completed_rule012Yes": "Rule 012",
    "compliance_requirement_met_env_reqYes": "environmental"
}

for question_id in compliance_questions:
    question = wait.until(EC.element_to_be_clickable((By.ID, question_id)))
    scroll_and_click(question)

# Click No for objections
objections = wait.until(EC.element_to_be_clickable((By.ID, "compliance_requirement_objectionsNo")))
scroll_and_click(objections)
```

## Step 9: Contact Information

1. Enter personal details:
```python
# Name
name_input = wait.until(EC.presence_of_element_located((By.ID, "customer_name")))
name_input.send_keys("John Doe")

# Phone
phone_input = wait.until(EC.presence_of_element_located((By.ID, "customer_phone")))
phone_input.send_keys("9999999999")

# Email
email_input = wait.until(EC.presence_of_element_located((By.ID, "email")))
email_input.send_keys("johndoe@trollmail.com")
```

2. Select email as preferred contact:
```python
email_checkbox = wait.until(EC.element_to_be_clickable((By.ID, "preferred-contact-checkbox-0")))
scroll_and_click(email_checkbox)
```

## Important Notes

1. Error Handling: The code includes error checking after each section. If errors occur, they're logged and screenshots are taken:
```python
try:
    error_messages = driver.find_elements(By.CLASS_NAME, "bg-error-25")
    if error_messages:
        print("Error messages found:")
        for error in error_messages:
            print(f"Error: {error.text}")
except:
    pass
```

2. Navigation: Each section has a Continue button that needs to be clicked:
```python
continue_button = wait.until(EC.element_to_be_clickable((
    By.XPATH, "//button[.//span[text()='Continue']]")))
scroll_and_click(continue_button)
```

3. Scrolling: Always scroll elements into view before clicking:
```python
driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
time.sleep(0.2)  # Small delay for scroll
```

4. Waiting: Use explicit waits instead of fixed delays:
```python
wait = WebDriverWait(driver, 10)  # 10 second timeout
element = wait.until(EC.element_to_be_clickable((By.ID, "element-id")))
```
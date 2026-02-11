from pdf2image import convert_from_path
import pytesseract
import cv2
import os

# Step 1: Convert PDF to images
pages = convert_from_path("1st.pdf", dpi=300)
os.makedirs("questions", exist_ok=True)

for page_num, page in enumerate(pages):
    img_path = f"page_{page_num+1}.png"
    page.save(img_path, "PNG")

    # Step 2: Load image and convert to OpenCV format
    img = cv2.imread(img_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Step 3: OCR to detect question numbers
    data = pytesseract.image_to_data(gray, output_type=pytesseract.Output.DICT)
    question_boxes = []

    for i, word in enumerate(data['text']):
        if word.strip().isdigit() and int(word) <= 100:
            x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
            question_boxes.append((x, y))

    # Step 4: Crop between question boxes
    question_boxes.sort(key=lambda b: b[1])  # sort by vertical position
    for i in range(len(question_boxes)):
        y_start = question_boxes[i][1]
        y_end = question_boxes[i+1][1] if i+1 < len(question_boxes) else img.shape[0]
        cropped = img[y_start:y_end, :]
        cv2.imwrite(f"questions/q{page_num+1}_{i+1}.png", cropped)
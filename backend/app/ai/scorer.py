from datetime import datetime
from app.config import settings
from app.ai.text_embedding import compute_text_similarity
from app.ai.image_embedding import compute_image_similarity

def calculate_category_similarity(cat1: str, cat2: str) -> float:
    if not cat1 or not cat2:
        return 0.0
    c1, c2 = cat1.strip().lower(), cat2.strip().lower()
    if c1 == c2:
        return 1.0
    if c1 in c2 or c2 in c1:
        return 0.7
    return 0.0

def calculate_location_similarity(loc1: str, loc2: str) -> float:
    if not loc1 or not loc2:
        return 0.0
    l1, l2 = loc1.strip().lower(), loc2.strip().lower()
    if l1 == l2:
        return 1.0
    
    # Common campus locations / keywords match
    words1 = set(l1.split())
    words2 = set(l2.split())
    intersection = words1.intersection(words2)
    if intersection:
        return len(intersection) / max(len(words1), len(words2))
    return 0.0

def calculate_date_similarity(date_str1: str, date_str2: str) -> float:
    try:
        d1 = datetime.strptime(date_str1[:10], "%Y-%m-%d")
        d2 = datetime.strptime(date_str2[:10], "%Y-%m-%d")
        diff_days = abs((d1 - d2).days)

        if diff_days == 0:
            return 1.0
        elif diff_days <= 2:
            return 0.85
        elif diff_days <= 7:
            return 0.60
        elif diff_days <= 14:
            return 0.30
        else:
            return 0.10
    except Exception:
        return 0.5  # Neutral fallback if date parsing fails

def compute_combined_match_score(lost_item, found_item) -> dict:
    """
    Computes text, image, category, location, and date similarities
    and returns a combined confidence score between 0 and 100.
    """
    # 1. Text Similarity (name + description + location)
    text1 = f"{lost_item.name}. {lost_item.description}. Location: {lost_item.location}"
    text2 = f"{found_item.name}. {found_item.description}. Location: {found_item.location}"
    text_sim = compute_text_similarity(text1, text2)

    # 2. Image Similarity
    has_image = bool(lost_item.image_path and found_item.image_path)
    if has_image:
        image_sim = compute_image_similarity(lost_item.image_path, found_item.image_path)
    else:
        image_sim = 0.0

    # 3. Category Similarity
    cat_sim = calculate_category_similarity(lost_item.category, found_item.category)

    # 4. Location Similarity
    loc_sim = calculate_location_similarity(lost_item.location, found_item.location)

    # 5. Date Proximity Similarity
    date_sim = calculate_date_similarity(lost_item.date, found_item.date)

    # Dynamic Weight Adjustment if images are missing
    if has_image and image_sim > 0.0:
        w_text = settings.WEIGHT_TEXT        # 0.40
        w_img = settings.WEIGHT_IMAGE        # 0.30
        w_cat = settings.WEIGHT_CATEGORY     # 0.15
        w_loc = settings.WEIGHT_LOCATION     # 0.10
        w_date = settings.WEIGHT_DATE        # 0.05
    else:
        # Scale remaining weights proportionally when image is not present
        w_text = 0.55
        w_img = 0.0
        w_cat = 0.20
        w_loc = 0.15
        w_date = 0.10

    weighted_score = (
        (text_sim * w_text) +
        (image_sim * w_img) +
        (cat_sim * w_cat) +
        (loc_sim * w_loc) +
        (date_sim * w_date)
    )

    confidence_score = round(weighted_score * 100.0, 2)

    return {
        "confidence_score": confidence_score,
        "text_similarity": round(text_sim, 4),
        "image_similarity": round(image_sim, 4),
        "category_similarity": round(cat_sim, 4),
        "location_similarity": round(loc_sim, 4),
        "date_similarity": round(date_sim, 4)
    }

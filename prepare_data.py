#!/usr/bin/env python3
"""
Preprocesses the USA machine shops CSV into optimized JSON files for the dashboard.
Outputs:
  data/shops_summary.json  - Aggregated stats (state counts, city counts, employee buckets)
  data/shops_geo.json      - Lightweight lat/lng + metadata for map markers
"""

import csv
import json
import os
from collections import Counter, defaultdict

CSV_PATH = os.path.join(os.path.dirname(__file__), "..", "usa_machine_shops.csv")
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

EMPLOYEE_BUCKETS = [
    (1, 5, "1-5"),
    (6, 10, "6-10"),
    (11, 25, "11-25"),
    (26, 50, "26-50"),
    (51, 100, "51-100"),
    (101, 250, "101-250"),
    (251, 500, "251-500"),
]


def bucket_label(emp_count):
    if emp_count == 0:
        return "Unknown"
    for lo, hi, label in EMPLOYEE_BUCKETS:
        if lo <= emp_count <= hi:
            return label
    return "251-500"


def main():
    os.makedirs(DATA_DIR, exist_ok=True)

    state_counts = Counter()
    city_counts = Counter()
    bucket_counts = Counter()
    state_bucket = defaultdict(Counter)
    total_employees = 0
    emp_count_valid = 0
    website_count = 0
    geo_records = []
    total = 0

    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            total += 1
            state = (row.get("state") or "").strip()
            city = (row.get("city") or "").strip()
            company = (row.get("company_name") or "").strip()
            website = (row.get("website") or "").strip()
            lat = (row.get("latitude") or "").strip()
            lng = (row.get("longitude") or "").strip()
            emp_raw = (row.get("employees") or "").strip()
            description = (row.get("description") or "").strip()

            try:
                emp = int(float(emp_raw)) if emp_raw else 0
            except ValueError:
                emp = 0

            if state:
                state_counts[state] += 1
            if city and state:
                city_counts[f"{city}, {state}"] += 1

            bl = bucket_label(emp)
            bucket_counts[bl] += 1
            if state:
                state_bucket[state][bl] += 1

            if emp > 0:
                total_employees += emp
                emp_count_valid += 1

            if website:
                website_count += 1

            if lat and lng:
                try:
                    rec = {
                        "n": company,
                        "c": city,
                        "s": state,
                        "e": emp,
                        "la": round(float(lat), 5),
                        "lo": round(float(lng), 5),
                    }
                    if website:
                        rec["w"] = website
                    geo_records.append(rec)
                except ValueError:
                    pass

    avg_emp = round(total_employees / emp_count_valid, 1) if emp_count_valid else 0
    states_covered = len(state_counts)
    cities_covered = len(city_counts)
    website_pct = round(website_count / total * 100, 1) if total else 0

    top_states = state_counts.most_common(20)
    top_cities = city_counts.most_common(15)
    top10_states = [s for s, _ in state_counts.most_common(10)]

    bucket_order = ["Unknown"] + [b[2] for b in EMPLOYEE_BUCKETS]
    bucket_dist = {b: bucket_counts.get(b, 0) for b in bucket_order}

    stacked_data = {}
    for st in top10_states:
        stacked_data[st] = {b: state_bucket[st].get(b, 0) for b in bucket_order if state_bucket[st].get(b, 0) > 0}

    summary = {
        "total_shops": total,
        "states_covered": states_covered,
        "cities_covered": cities_covered,
        "avg_employees": avg_emp,
        "website_pct": website_pct,
        "top_states": [{"state": s, "count": c} for s, c in top_states],
        "top_cities": [{"city": c, "count": n} for c, n in top_cities],
        "employee_buckets": bucket_dist,
        "stacked_state_buckets": stacked_data,
    }

    summary_path = os.path.join(DATA_DIR, "shops_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, separators=(",", ":"))
    print(f"Wrote {summary_path} ({os.path.getsize(summary_path):,} bytes)")

    geo_path = os.path.join(DATA_DIR, "shops_geo.json")
    with open(geo_path, "w", encoding="utf-8") as f:
        json.dump(geo_records, f, separators=(",", ":"))
    print(f"Wrote {geo_path} ({os.path.getsize(geo_path):,} bytes)")

    print(f"\nSummary: {total:,} shops, {states_covered} states, {cities_covered:,} cities")
    print(f"Average employees: {avg_emp}, Websites: {website_pct}%")
    print(f"Geo records: {len(geo_records):,}")


if __name__ == "__main__":
    main()

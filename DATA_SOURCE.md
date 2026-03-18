# Data Source Documentation

## Overview

This project uses real occupation data from the **jobs-master** project, which aggregates data from the US Bureau of Labor Statistics (BLS) Occupational Outlook Handbook (OOH).

## Data Files

### Source: jobs-master

The `jobs-master` project provides comprehensive occupation data extracted from BLS:

- **Location**: `../jobs-master/`
- **Primary Files**:
  - `occupations.csv` - Employment statistics and BLS data
  - `scores.json` - AI exposure scores (0-10 scale)
  - `site/data.json` - Merged dataset with all fields

### Data Fields Mapping

The `occupations.json` file in this project uses the following fields from jobs-master:

| Field | Source | Description |
|-------|--------|-------------|
| `jobId` | `occupations.csv` (soc_code) | BLS Standard Occupational Classification code |
| `title` | `occupations.csv` (title) | Occupation title in English |
| `aiExposureScore` | `scores.json` (exposure) | AI exposure score (0-10 scale) |
| `medianWage` | `occupations.csv` (median_pay_annual) | Annual median wage in USD |
| `employment` | `occupations.csv` (num_jobs_2024) | Number of jobs in 2024 |
| `growthRate` | `occupations.csv` (outlook_pct) | Employment growth rate (%) 2024-2034 |

## How to Reproduce

### Step 1: Extract Data from jobs-master

```bash
# Navigate to jobs-master directory
cd ../jobs-master

# The data is already processed. Key files:
# - occupations.csv (employment stats)
# - scores.json (AI exposure scores)
```

### Step 2: Create occupations.json

```bash
# In career-ai-impact directory
# Create data/occupations.json by selecting occupations from jobs-master

# Example: Extract top 25 occupations by employment
python3 << 'EOF'
import csv
import json

# Read occupations.csv from jobs-master
with open('../jobs-master/occupations.csv') as f:
    reader = csv.DictReader(f)
    occupations = list(reader)

# Sort by employment (num_jobs_2024) descending
occupations.sort(key=lambda x: int(x['num_jobs_2024'] or 0), reverse=True)

# Load AI exposure scores
with open('../jobs-master/scores.json') as f:
    scores = json.load(f)
    scores_map = {s['slug']: s for s in scores}

# Create output
output = []
for occ in occupations[:25]:  # Top 25
    slug = occ['slug']
    score = scores_map.get(slug, {})
    
    output.append({
        'jobId': occ['soc_code'],
        'title': occ['title'],
        'aiExposureScore': score.get('exposure', 5),
        'medianWage': int(occ['median_pay_annual']) if occ['median_pay_annual'] else None,
        'employment': int(occ['num_jobs_2024']) if occ['num_jobs_2024'] else None,
        'growthRate': int(occ['outlook_pct']) if occ['outlook_pct'] else None,
    })

# Write to file
with open('data/occupations.json', 'w') as f:
    json.dump(output, f, indent=2)

print(f"Created occupations.json with {len(output)} occupations")
EOF
```

### Step 3: Verify Data

```bash
# Check that occupations.json has been created
ls -la data/occupations.json

# Verify format
cat data/occupations.json | head -20
```

## Data Quality Notes

- **AI Exposure Scores**: Calibrated 0-10 scale where:
  - 0-3: Low exposure (physical/interpersonal work)
  - 4-6: Medium exposure (hybrid roles)
  - 7-10: High exposure (digital/knowledge work)

- **Employment Data**: Based on BLS 2024 estimates and 2034 projections

- **Wage Data**: Median annual wages from BLS OOH

- **Growth Rates**: Percentage change in employment 2024-2034

## API Implementation

The `/api/career-impact/summary` endpoint:

1. Reads `data/occupations.json` from the server
2. Finds occupation by `jobId` (SOC code)
3. Maps `aiExposureScore` to level: low (0-3), medium (3-6), high (6-10)
4. Generates contextual risks and opportunities based on occupation type
5. Returns JSON response with all fields

## Updating Data

To update with more occupations:

1. Modify the extraction script to include more occupations
2. Ensure all required fields are present
3. Update `public/data/occupations.json` (for frontend)
4. Update `data/occupations.json` (for API)
5. Test API endpoint: `GET /api/career-impact/summary?job_id=15-1252`

## References

- **BLS Occupational Outlook Handbook**: https://www.bls.gov/ooh/
- **jobs-master Project**: `../jobs-master/README.md`
- **AI Exposure Methodology**: See jobs-master scoring rubric in `scores.json`

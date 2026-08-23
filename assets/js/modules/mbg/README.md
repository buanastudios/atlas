# MBG Module — Program Makan Bergizi Gratis
**SD At-Tibyan** · Controlled Document Form: `FORM-MBG-01 REV-00`

## Overview
This module digitizes the daily food receipt, allergen diet substitution tracking, pre-distribution organoleptic safety testing, and multi-party sign-off for the Program Makan Bergizi Gratis (MBG) at SD At-Tibyan.

## Key Features
1. **Form Penerimaan Harian:**
   - 4-Component General Menu: Karbohidrat, Lauk Hewani/Nabati, Sayur, Buah/Susu.
   - Special Allergy Diet Substitutions per named student.
   - Packaging tracker (Normal Pax + Allergy Pax = Total Pax, Box vs Tray, Seal integrity check).
   - Receiver & Courier contact & signature logging.

2. **Organoleptic Inspection Matrix:**
   - Evaluates Aroma, Tampilan, Rasa, and Tekstur against standardized positive and negative criteria.
   - Requires explicit conclusion: `Layak Edar` (Permitted for consumption) or `Tidak Layak Edar` (Rejected).

3. **1:1 Official Document Printable View:**
   - Exact layout replica of official controlled document `FORM-MBG-01 REV-00` ready for physical print and archiving.

4. **REST API:**
   - `GET /api/get-mbg`
   - `POST /api/submit-mbg`

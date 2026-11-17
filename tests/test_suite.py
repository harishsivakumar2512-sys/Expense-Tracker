import urllib.request
import urllib.error
import json
import time
import re
from datetime import datetime

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None, token=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            elapsed = (time.perf_counter() - start) * 1000
            content = response.read().decode("utf-8")
            try:
                parsed = json.loads(content)
            except Exception:
                parsed = content
            return {
                "status": response.status,
                "data": parsed,
                "raw": content,
                "elapsed": elapsed,
                "error": None
            }
    except urllib.error.HTTPError as e:
        elapsed = (time.perf_counter() - start) * 1000
        error_content = e.read().decode("utf-8")
        try:
            parsed = json.loads(error_content)
        except Exception:
            parsed = error_content
        return {
            "status": e.code,
            "data": parsed,
            "raw": error_content,
            "elapsed": elapsed,
            "error": str(e)
        }
    except Exception as e:
        elapsed = (time.perf_counter() - start) * 1000
        return {
            "status": 0,
            "data": None,
            "raw": "",
            "elapsed": elapsed,
            "error": str(e)
        }

def run_all_tests():
    print("=" * 80)
    print("EXPENSE TRACKER - 20 COMPREHENSIVE AUTOMATED TEST CASES")
    print(f"Target: {BASE_URL} | Execution Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Reset baseline fixture to screenshot defaults
    try:
        import sys, os
        sys.path.append('backend')
        import seed_data
        seed_data.seed()
        print("Test fixture baseline seeded successfully.\n")
    except Exception as e:
        print("Note: Could not run direct seed_data fixture:", e)

    results = []
    auth_token = None
    refresh_token = None
    created_tx_id = None
    unique_user_email = f"test_{int(time.time())}@example.com"

    # --- TC-01: User Registration with Valid Data ---
    res1 = make_request("/api/auth/register/", method="POST", data={
        "name": "Alex Morgan",
        "email": unique_user_email,
        "password": "Password123!",
        "confirm_password": "Password123!"
    })
    pass1 = (
        res1["status"] == 201 and 
        "access" in res1["data"] and 
        res1["data"]["user"]["email"] == unique_user_email
    )
    results.append({
        "id": "TC-01",
        "title": "User Registration - Valid Credentials",
        "module": "UC-01 Auth",
        "expected": "HTTP 201, User registered, JWT tokens generated",
        "actual": f"HTTP {res1['status']}, User: {res1['data'].get('user', {}).get('email') if isinstance(res1['data'], dict) else 'N/A'}",
        "elapsed": res1["elapsed"],
        "passed": pass1
    })

    # --- TC-02: User Registration - Password Mismatch Validation ---
    res2 = make_request("/api/auth/register/", method="POST", data={
        "name": "Invalid User",
        "email": "mismatch@example.com",
        "password": "Password123!",
        "confirm_password": "DifferentPassword!"
    })
    pass2 = (
        res2["status"] == 400 and 
        "confirm_password" in res2["data"]
    )
    results.append({
        "id": "TC-02",
        "title": "User Registration - Password Mismatch Validation",
        "module": "UC-01 Auth",
        "expected": "HTTP 400 Bad Request with confirm_password error",
        "actual": f"HTTP {res2['status']}, Error: {res2['data']}",
        "elapsed": res2["elapsed"],
        "passed": pass2
    })

    # --- TC-03: User Registration - Duplicate Email Rejection ---
    res3 = make_request("/api/auth/register/", method="POST", data={
        "name": "Duplicate Harish",
        "email": "harish@example.com",
        "password": "password123",
        "confirm_password": "password123"
    })
    pass3 = (
        res3["status"] == 400 and 
        "email" in res3["data"]
    )
    results.append({
        "id": "TC-03",
        "title": "User Registration - Duplicate Email Rejection",
        "module": "UC-01 Auth",
        "expected": "HTTP 400 Bad Request, email already exists",
        "actual": f"HTTP {res3['status']}, Error: {res3['data']}",
        "elapsed": res3["elapsed"],
        "passed": pass3
    })

    # --- TC-04: User Login - Valid Credentials ---
    res4 = make_request("/api/auth/login/", method="POST", data={
        "email": "harish@example.com",
        "password": "password123"
    })
    pass4 = (
        res4["status"] == 200 and 
        "access" in res4["data"] and 
        "refresh" in res4["data"]
    )
    if pass4:
        auth_token = res4["data"]["access"]
        refresh_token = res4["data"]["refresh"]
    results.append({
        "id": "TC-04",
        "title": "User Login - Valid Credentials",
        "module": "UC-01 Auth",
        "expected": "HTTP 200 OK, JWT access & refresh tokens returned",
        "actual": f"HTTP {res4['status']}, Token Length: {len(res4['data'].get('access', ''))}",
        "elapsed": res4["elapsed"],
        "passed": pass4
    })

    # --- TC-05: User Login - Invalid Credentials ---
    res5 = make_request("/api/auth/login/", method="POST", data={
        "email": "harish@example.com",
        "password": "WrongPassword999!"
    })
    pass5 = (
        res5["status"] == 401 and 
        "detail" in res5["data"]
    )
    results.append({
        "id": "TC-05",
        "title": "User Login - Invalid Password Handling",
        "module": "UC-01 Auth",
        "expected": "HTTP 401 Unauthorized, 'Invalid email or password.'",
        "actual": f"HTTP {res5['status']}, Detail: {res5['data'].get('detail')}",
        "elapsed": res5["elapsed"],
        "passed": pass5
    })

    # --- TC-06: JWT Token Refresh Mechanism ---
    res6 = make_request("/api/auth/token/refresh/", method="POST", data={
        "refresh": refresh_token
    })
    pass6 = (
        res6["status"] == 200 and 
        "access" in res6["data"]
    )
    results.append({
        "id": "TC-06",
        "title": "JWT Authentication - Token Refresh",
        "module": "UC-01 Auth",
        "expected": "HTTP 200 OK, New JWT access token issued",
        "actual": f"HTTP {res6['status']}, New Access Token Length: {len(res6['data'].get('access', ''))}",
        "elapsed": res6["elapsed"],
        "passed": pass6
    })

    # --- TC-07: Current User Profile Retrieval (/api/auth/me/) ---
    res7 = make_request("/api/auth/me/", token=auth_token)
    pass7 = (
        res7["status"] == 200 and 
        res7["data"].get("email") == "harish@example.com" and 
        res7["data"].get("name") == "Harish S"
    )
    results.append({
        "id": "TC-07",
        "title": "User Profile Endpoint (/api/auth/me/)",
        "module": "UC-01 Auth",
        "expected": "HTTP 200 OK, Profile name 'Harish S' & email 'harish@example.com'",
        "actual": f"HTTP {res7['status']}, Name: '{res7['data'].get('name')}', Email: '{res7['data'].get('email')}'",
        "elapsed": res7["elapsed"],
        "passed": pass7
    })

    # --- TC-08: Protected Route Security - Unauthenticated Rejection ---
    res8 = make_request("/api/dashboard/summary/", token=None)
    pass8 = (res8["status"] == 401)
    results.append({
        "id": "TC-08",
        "title": "Security - Protected Endpoint Unauthenticated Access",
        "module": "Security",
        "expected": "HTTP 401 Unauthorized when Bearer token is missing",
        "actual": f"HTTP {res8['status']} {res8['error']}",
        "elapsed": res8["elapsed"],
        "passed": pass8
    })

    # --- TC-09: Category Listing Verification (/api/categories/) ---
    res9 = make_request("/api/categories/", token=auth_token)
    categories = res9["data"] if isinstance(res9["data"], list) else []
    cat_names = [c.get("name") for c in categories]
    pass9 = (
        res9["status"] == 200 and 
        len(categories) == 5 and 
        "Food & Dining" in cat_names and 
        "Shopping" in cat_names
    )
    results.append({
        "id": "TC-09",
        "title": "Category Listing & Seed Verification",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200 OK, 5 categories with icons and hex colors",
        "actual": f"HTTP {res9['status']}, Found {len(categories)} categories: {cat_names}",
        "elapsed": res9["elapsed"],
        "passed": pass9
    })

    # --- TC-10: Dashboard Summary Baseline Metrics ---
    res10 = make_request("/api/dashboard/summary/?period=this_month", token=auth_token)
    d10 = res10["data"] if isinstance(res10["data"], dict) else {}
    pass10 = (
        res10["status"] == 200 and 
        d10.get("total_income") == 25000.0 and 
        d10.get("total_expenses") == 16750.0 and 
        d10.get("savings") == 8250.0
    )
    results.append({
        "id": "TC-10",
        "title": "Dashboard Summary KPI Metrics Baseline",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200, Income: ₹25,000, Expenses: ₹16,750, Savings: ₹8,250",
        "actual": f"HTTP {res10['status']}, Inc: ₹{d10.get('total_income')}, Exp: ₹{d10.get('total_expenses')}, Sav: ₹{d10.get('savings')}",
        "elapsed": res10["elapsed"],
        "passed": pass10
    })

    # --- TC-11: Dashboard Savings Mathematical Formula Invariant ---
    calc_savings = d10.get("total_income", 0) - d10.get("total_expenses", 0)
    pass11 = (calc_savings == d10.get("savings"))
    results.append({
        "id": "TC-11",
        "title": "Financial Integrity - Savings Balance Invariant",
        "module": "UC-02 Dashboard",
        "expected": "Savings equals (Total Income - Total Expenses)",
        "actual": f"Income ({d10.get('total_income')}) - Expenses ({d10.get('total_expenses')}) = {calc_savings} == Savings ({d10.get('savings')})",
        "elapsed": 0.05,
        "passed": pass11
    })

    # --- TC-12: Expense Overview Line Chart - Default Range (This Month) ---
    res12 = make_request("/api/dashboard/overview/?range=this_month", token=auth_token)
    pts12 = res12["data"].get("data", []) if isinstance(res12["data"], dict) else []
    pass12 = (
        res12["status"] == 200 and 
        len(pts12) == 7 and 
        pts12[0].get("day") == "Mon" and 
        pts12[-1].get("day") == "Sun"
    )
    results.append({
        "id": "TC-12",
        "title": "Expense Overview Line Chart - Mon to Sun Curve",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200, 7 daily data points (Mon-Sun) with income & expenses",
        "actual": f"HTTP {res12['status']}, {len(pts12)} points, Mon: Inc {pts12[0].get('income')}/Exp {pts12[0].get('expenses')}",
        "elapsed": res12["elapsed"],
        "passed": pass12
    })

    # --- TC-13: Expense Overview Line Chart - Range Filtering ---
    res13a = make_request("/api/dashboard/overview/?range=last_month", token=auth_token)
    res13b = make_request("/api/dashboard/overview/?range=6_months", token=auth_token)
    pass13 = (
        res13a["status"] == 200 and 
        res13b["status"] == 200 and 
        len(res13a["data"].get("data", [])) == 4 and 
        len(res13b["data"].get("data", [])) == 6
    )
    results.append({
        "id": "TC-13",
        "title": "Expense Overview Chart - Range Filtering",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200, 'last_month' returns 4 weeks, '6_months' returns 6 months",
        "actual": f"Last Month: {len(res13a['data'].get('data', []))} pts, 6 Months: {len(res13b['data'].get('data', []))} pts",
        "elapsed": res13a["elapsed"] + res13b["elapsed"],
        "passed": pass13
    })

    # --- TC-14: Category Spending Donut Chart Breakdown ---
    res14 = make_request("/api/dashboard/category-spending/?period=this_month", token=auth_token)
    d14 = res14["data"] if isinstance(res14["data"], dict) else {}
    cats14 = d14.get("categories", [])
    total_pct = sum(c.get("percentage", 0) for c in cats14)
    pass14 = (
        res14["status"] == 200 and 
        d14.get("total_spending") == 16750.0 and 
        total_pct == 100
    )
    results.append({
        "id": "TC-14",
        "title": "Category Spending Donut Distribution (Percentages Sum = 100%)",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200, Total: ₹16,750, Categories sum to 100%",
        "actual": f"HTTP {res14['status']}, Total: ₹{d14.get('total_spending')}, Sum Percentage: {total_pct}%",
        "elapsed": res14["elapsed"],
        "passed": pass14
    })

    # --- TC-15: Recent Transactions List Limit & Chronology ---
    res15 = make_request("/api/transactions/?limit=4", token=auth_token)
    txs15 = res15["data"] if isinstance(res15["data"], list) else []
    first_tx = txs15[0] if txs15 else {}
    pass15 = (
        res15["status"] == 200 and 
        len(txs15) == 4 and 
        "Domino" in first_tx.get("note", "")
    )
    results.append({
        "id": "TC-15",
        "title": "Recent Transactions List (Limit=4) Chronology",
        "module": "UC-02 Dashboard",
        "expected": "HTTP 200, Exactly 4 recent transactions, latest first (Domino's)",
        "actual": f"HTTP {res15['status']}, Count: {len(txs15)}, 1st: '{first_tx.get('note')}' (-₹{first_tx.get('amount')})",
        "elapsed": res15["elapsed"],
        "passed": pass15
    })

    # --- TC-16: Add Transaction - Valid Expense (UC-03) ---
    res16 = make_request("/api/transactions/", method="POST", token=auth_token, data={
        "type": "expense",
        "category_id": 4, # Entertainment
        "amount": 750.00,
        "note": "Movie & Popcorn"
    })
    pass16 = (
        res16["status"] == 201 and 
        float(res16["data"].get("amount", 0)) == 750.00 and 
        res16["data"].get("note") == "Movie & Popcorn"
    )
    if pass16:
        created_tx_id = res16["data"]["id"]
    results.append({
        "id": "TC-16",
        "title": "Add Transaction - Valid Expense Record",
        "module": "UC-03 Transaction",
        "expected": "HTTP 201 Created, Transaction persisted with ID and formatted date",
        "actual": f"HTTP {res16['status']}, Created Tx ID: {created_tx_id}, Amount: ₹{res16['data'].get('amount')}",
        "elapsed": res16["elapsed"],
        "passed": pass16
    })

    # --- TC-17: Dynamic Recalculation after Transaction ---
    res17 = make_request("/api/dashboard/summary/?period=this_month", token=auth_token)
    d17 = res17["data"] if isinstance(res17["data"], dict) else {}
    # Baseline was 16750, added 750 -> 17500. Savings was 8250 - 750 -> 7500
    pass17 = (
        res17["status"] == 200 and 
        d17.get("total_expenses") == 17500.0 and 
        d17.get("savings") == 7500.0
    )
    results.append({
        "id": "TC-17",
        "title": "Dynamic Reactive Recalculation of Totals & Savings",
        "module": "UC-03 Transaction",
        "expected": "Total Expenses increases to ₹17,500 (+₹750), Savings drops to ₹7,500",
        "actual": f"HTTP {res17['status']}, Expenses: ₹{d17.get('total_expenses')}, Savings: ₹{d17.get('savings')}",
        "elapsed": res17["elapsed"],
        "passed": pass17
    })

    # --- TC-18: Add Transaction Validation - Negative or Zero Amount Rejection ---
    res18 = make_request("/api/transactions/", method="POST", token=auth_token, data={
        "type": "expense",
        "category_id": 1,
        "amount": -50.00,
        "note": "Invalid Negative Amount"
    })
    pass18 = (
        res18["status"] == 400 and 
        "amount" in res18["data"]
    )
    results.append({
        "id": "TC-18",
        "title": "Add Transaction Validation - Negative/Zero Amount Rejection",
        "module": "UC-03 Transaction",
        "expected": "HTTP 400 Bad Request, 'Amount must be greater than zero.'",
        "actual": f"HTTP {res18['status']}, Error: {res18['data']}",
        "elapsed": res18["elapsed"],
        "passed": pass18
    })

    # --- TC-19: Transaction Deletion and State Reversion ---
    if created_tx_id:
        res19 = make_request(f"/api/transactions/{created_tx_id}/", method="DELETE", token=auth_token)
        # Verify reversion
        res19_sum = make_request("/api/dashboard/summary/?period=this_month", token=auth_token)
        d19_sum = res19_sum["data"] if isinstance(res19_sum["data"], dict) else {}
        pass19 = (
            res19["status"] == 204 and 
            d19_sum.get("total_expenses") == 16750.0 and 
            d19_sum.get("savings") == 8250.0
        )
    else:
        pass19 = False
        res19 = {"status": 0, "elapsed": 0}
    results.append({
        "id": "TC-19",
        "title": "Transaction Deletion & Baseline Reversion",
        "module": "UC-03 Transaction",
        "expected": "HTTP 204 No Content, Expenses restored to ₹16,750, Savings to ₹8,250",
        "actual": f"HTTP {res19['status']}, Restored Expenses: ₹{d19_sum.get('total_expenses')}, Savings: ₹{d19_sum.get('savings')}",
        "elapsed": res19["elapsed"],
        "passed": pass19
    })

    # --- TC-20: Merged Unified Link Delivery & Static Assets ---
    res20_html = make_request("/")
    html_ok = (
        res20_html["status"] == 200 and 
        "Expense Tracker" in res20_html["raw"] and 
        '<div id="root">' in res20_html["raw"]
    )
    # Check JS bundle asset delivery
    asset_matches = re.findall(r'(?:src|href)="(/assets/[^"]+)"', res20_html["raw"])
    assets_ok = True
    if asset_matches:
        for a_path in asset_matches[:2]:
            a_res = make_request(a_path)
            if a_res["status"] != 200:
                assets_ok = False
    else:
        assets_ok = False
        
    pass20 = html_ok and assets_ok
    results.append({
        "id": "TC-20",
        "title": "Unified Merged Link & Asset Bundling Delivery",
        "module": "Deployment",
        "expected": "HTTP 200 OK for HTML and bundled JS/CSS on merged port 8000",
        "actual": f"HTML Status: {res20_html['status']}, Assets Verified: {assets_ok} ({len(asset_matches)} assets found)",
        "elapsed": res20_html["elapsed"],
        "passed": pass20
    })

    # --- Print Summary Table ---
    print("\n" + "-" * 115)
    print(f"{'ID':<7} | {'Module':<16} | {'Test Case Title':<38} | {'Latency':<8} | {'Status':<6}")
    print("-" * 115)
    passed_count = 0
    for r in results:
        status_str = "PASS" if r["passed"] else "FAIL"
        if r["passed"]:
            passed_count += 1
        print(f"{r['id']:<7} | {r['module']:<16} | {r['title'][:36]:<38} | {r['elapsed']:>6.1f}ms | {status_str:<6}")
    print("-" * 115)
    print(f"RESULTS SUMMARY: {passed_count}/{len(results)} Passed ({(passed_count/len(results))*100:.1f}%) | Total Time: {sum(r['elapsed'] for r in results):.1f}ms")
    print("=" * 115)
    
    # Write json output for inspection
    with open("tests/test_results.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "total": len(results),
            "passed": passed_count,
            "failed": len(results) - passed_count,
            "cases": results
        }, f, indent=2)

if __name__ == "__main__":
    run_all_tests()

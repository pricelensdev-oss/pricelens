# PriceLens Database Schema (Supabase/PostgreSQL)

This document outlines the proposed database structure to transition from localStorage to persistent, cloud-synced purchase intelligence.

## 1. Profiles (`profiles`)
Extends Clerk user data with platform-specific shopping preferences.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | Clerk User ID |
| `pincode` | `varchar(6)` | Default delivery location |
| `is_business_user` | `boolean` | GST Input Credit toggle |
| `exchange_value_pref` | `integer` | Default exchange estimation |
| `wallet_balance` | `decimal` | Accrued savings from Shield claims |
| `created_at` | `timestamp` | |

## 2. Watchlist (`watchlist`)
Tracks items users are monitoring.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | |
| `user_id` | `uuid` (FK) | References `profiles.id` |
| `product_id` | `varchar` | Marketplace Product ID |
| `target_price` | `decimal` | User's desired price point |
| `added_at` | `timestamp` | |

## 3. Protected Purchases (`protected_purchases`)
The core data layer for the **PriceLens Shield**.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | |
| `user_id` | `uuid` (FK) | References `profiles.id` |
| `product_id` | `varchar` | |
| `purchase_price` | `decimal` | Original price paid |
| `purchase_date` | `date` | Start of 7-day window |
| `platform_id` | `varchar` | amazon / flipkart / etc. |
| `shield_status` | `enum` | `active`, `claimed`, `expired` |
| `savings_recovered` | `decimal` | Amount returned to wallet |

## 4. Price History (`price_snapshots`)
For trend analysis and trigger logic.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` (PK) | |
| `product_id` | `varchar` | |
| `platform_id` | `varchar` | |
| `price` | `decimal` | |
| `timestamp` | `timestamp` | |

---

## Strategic Moat Integration
- **Automated Claims**: A Postgres Trigger will run after every `price_snapshots` insert. If a price is lower than a `protected_purchases` price for the same user within 7 days, a record is added to the `notifications` table.
- **Fraud Prevention**: The `purchase_date` is locked at insertion and cannot be modified by the user to extend the protection window.

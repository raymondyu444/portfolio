# DNS setup for ryuportfolio.com → GitHub Pages

Use this when you're in your domain's DNS settings (Namecheap, GoDaddy, Cloudflare, etc.).

---

## 1. Add 4 A records (for ryuportfolio.com)

Create **four separate A records**. Each has the same Name, different Value.

| Type | Name / Host | Value | TTL |
|------|-------------|--------|-----|
| A | `@` or leave blank | `185.199.108.153` | 300 or Auto |
| A | `@` or leave blank | `185.199.109.153` | 300 or Auto |
| A | `@` or leave blank | `185.199.110.153` | 300 or Auto |
| A | `@` or leave blank | `185.199.111.153` | 300 or Auto |

- **Name:** If your provider shows "ryuportfolio.com" next to the field, use `@` or leave the field blank.
- **Value:** Copy each IP exactly (one per record).

---

## 2. Add 1 CNAME record (for www.ryuportfolio.com)

| Type | Name / Host | Value | TTL |
|------|-------------|--------|-----|
| CNAME | `www` | `raymondyu444.github.io` | 300 or Auto |

- **Name:** `www` (so it becomes www.ryuportfolio.com).
- **Value:** `raymondyu444.github.io` (no `https://`, no trailing slash).

---

## 3. Optional: keep the TXT record for verification

You can leave the existing TXT record as-is:

| Type | Name / Host | Value |
|------|-------------|--------|
| TXT | `_github-pages-challenge-raymondyu444` | `3a3297e57e259eba424ff96b2bf3ce` |

---

## 4. Save and wait

- Click **Save** / **Add record** for each entry.
- DNS can take a few minutes up to 24–48 hours to propagate.
- In GitHub: **Settings → Pages** → ensure custom domain is **ryuportfolio.com** and **Enforce HTTPS** is checked when it becomes available.

---

## Quick copy-paste

**A record values (add 4 records, one per line):**
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME value:**
```
raymondyu444.github.io
```

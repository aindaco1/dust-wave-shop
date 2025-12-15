# Content Editor Guide

A guide for non-programmers to manage products on the DUST WAVE shop.

## Getting Started

1. Go to **[app.pagescms.org](https://app.pagescms.org)**
2. Click **"Sign in with GitHub"**
3. Select the **dust-wave-shop** repository
4. You'll see two collections:
   - **🛒 Products (Live on Shop)** — Products currently for sale
   - **📦 Out of Stock (Archived)** — Products removed from the shop

---

## Adding a New Product

1. Click **🛒 Products** in the sidebar
2. Click **"New"** button
3. Fill in the fields:

| Field | What to enter |
|-------|---------------|
| **Identifier** | Unique ID like `shirt-dustwave` or `poster-sexpot` (lowercase, dashes, no spaces) |
| **Product Name** | What customers see: "DUST WAVE T-Shirt" |
| **Price ($)** | Just the number: `25` (no dollar sign) |
| **Product Image** | Click to upload or select from existing images |
| **Product Type** | Choose: shirt, physical, digital, or sold-out |
| **Display Order** | Lower numbers appear first. Use 10, 20, 30... |
| **Sizes** | (Shirts only) Check which sizes are available |
| **Ticket Options** | (Digital only) Add ticket tiers with prices |
| **Description** | Edit the template or write your own (HTML) |

4. Click **Save**
5. Changes go live in ~1-2 minutes

---

## Product Types Explained

| Type | Use for | What happens |
|------|---------|--------------|
| **Shirt** | T-shirts | Shows size dropdown (XS-3XL) |
| **Physical** | Mugs, posters, VHS, etc. | Simple buy button |
| **Digital** | Event tickets, downloads | Shows ticket tier dropdown |
| **Sold Out** | Temporarily unavailable | Product visible, buy button hidden |

---

## Archiving a Product (Remove from Shop)

When a product is no longer available:

1. Open the product in **🛒 Products**
2. Change **Product Type** to **"⚠️ ARCHIVE"**
3. Click **Save**
4. **Wait ~30 seconds** — the product will automatically move to Out of Stock

The product keeps all its info (price, description, etc.) in case you want to restore it later.

---

## Restoring a Product (Bring Back to Shop)

To bring an archived product back:

1. Go to **📦 Out of Stock (Archived)**
2. Open the product you want to restore
3. Change **Product Type** to **"⚠️ UNARCHIVE"**
4. Click **Save**
5. **Wait ~30 seconds** — the product will automatically move back to Products

---

## Changing Product Order

Products are sorted by **Display Order** (lowest first).

**Tips:**
- Use increments of 10: `10, 20, 30, 40...`
- To insert a product between 20 and 30, give it order `25`
- New products default to order `0` (appear first)

---

## Adding Event Tickets (Digital Products)

For events with ticket tiers:

1. Set **Product Type** to **Digital**
2. Scroll to **Ticket Options**
3. Click **Add** for each tier:
   - **Option Name**: "Standard Ticket" or "VIP Entry"
   - **Price**: Just the number
   - **SKU**: Optional tracking code like `dancewave-std`

---

## Uploading Images

- Click the **Product Image** field
- Drag & drop or click to upload
- **Best sizes:**
  - Square: 1000 x 1000 pixels
  - Portrait: 1000 x 1500 pixels
- **Formats:** PNG or JPG

---

## Writing Descriptions (HTML)

The description field uses HTML. Common tags:

| To get... | Write... |
|-----------|----------|
| **Bold text** | `<strong>Bold</strong>` |
| *Italic text* | `<em>Italic</em>` |
| Line break | `<br>` |
| Big header | `<h2>Header</h2>` |
| Link | `<a href="https://example.com">Click here</a>` |

**Example for a shirt:**
```
100% cotton. Available in XS, S, M, L, XL, 2XL, 3XL.
```

**Example for an event:**
```html
<strong>Dust Wave</strong> presents ...
<br>
<h2>🎬 MOVIE NIGHT 🎬</h2>
Join us at <strong>the Guild Cinema on December 20th at 8pm</strong>!
<br><br>
<strong>Doors open at 7:30pm. All tickets are will call at the door.</strong>
```

---

## Troubleshooting

**Product not showing on site?**
- Wait 1-2 minutes for deploy
- Check that Product Type isn't "sold-out" or "archive"

**Archive/unarchive not working?**
- Make sure you clicked Save
- Wait 30 seconds for the automation
- Check that you selected the right type

**Image not uploading?**
- Try a smaller file size
- Use PNG or JPG format

**Need help?**
Contact the dev team or check the [GitHub repo](https://github.com/aindaco1/dust-wave-shop).

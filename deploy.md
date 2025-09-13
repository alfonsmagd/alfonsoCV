# Deployment Guide for Alfonso CV

## GitHub Pages Setup

### 1. Repository Name Options:
- **Main site**: `alfonso.github.io` (your main portfolio)
- **Project site**: `alfonso-cv` (accessible at alfonso.github.io/alfonso-cv)

### 2. Commands to deploy:
```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

### 3. GitHub Pages Settings:
- Go to Settings > Pages
- Source: Deploy from a branch
- Branch: main
- Folder: / (root)

### 4. Your site will be available at:
- `https://YOUR-USERNAME.github.io` (if repo name is YOUR-USERNAME.github.io)
- `https://YOUR-USERNAME.github.io/REPO-NAME` (for other repo names)

## Performance Tips:
- ✅ All assets are optimized
- ✅ WebGL demos work in browsers
- ✅ Responsive design implemented
- ✅ Fast loading particle system

## Browser Compatibility:
- ✅ Chrome, Firefox, Safari, Edge
- ✅ WebGL 1.0/2.0 support detected
- ✅ Mobile responsive

## SEO Optimization:
- Add meta description in index.html
- Add Open Graph tags for social sharing
- Consider adding favicon.ico

## Updates:
To update your site, just:
```bash
git add .
git commit -m "Update: description of changes"
git push
```

Changes will appear on your site within 1-10 minutes.

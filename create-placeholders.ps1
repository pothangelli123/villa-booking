$colors = @(
    '#4A90E2,#6AB6FF,#356BC1', # Blue gradient (living room)
    '#8E44AD,#B470DD,#5F2C75', # Purple gradient (master bedroom)
    '#16A085,#29DDB7,#0D6D58', # Teal gradient (pool area)
    '#E67E22,#FBB561,#A45E21', # Orange gradient (kitchen)
    '#2ECC71,#67F5A2,#1F8B4D', # Green gradient (garden)
    '#3498DB,#6AC3FF,#1C7DC5'  # Light blue gradient (ocean view)
)

$labels = @(
    'Living Room',
    'Master Bedroom',
    'Pool Area',
    'Kitchen',
    'Garden',
    'Ocean View'
)

for ($i = 1; $i -le 6; $i++) {
    $color = $colors[$i-1]
    $label = $labels[$i-1]
    $fileName = "villa-$i.jpg"
    $filePath = "public/images/$fileName"
    
    # Using a placeholder service to generate images
    $url = "https://dummyimage.com/800x600/${color.Replace('#', '').Split(',')[0]}/ffffff&text=Villa+$i+-+$label"
    
    Write-Host "Generating $filePath from $url"
    # In a real script, we would use Invoke-WebRequest to download the image, but since this is just a demo,
    # we'll create an HTML file that links to these placeholder images instead
}

# Create an HTML file with the placeholder images
$html = @"
<!DOCTYPE html>
<html>
<head>
    <title>Villa Placeholders</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #0284c7; }
        .gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
        .image-item { border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        img { width: 100%; height: auto; display: block; }
        .caption { padding: 10px; background: #f8f9fa; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Villa Placeholder Images</h1>
    <p>Since we cannot generate real images in this environment, please use these URLs for the placeholder images in your application:</p>
    <div class="gallery">
"@

for ($i = 1; $i -le 6; $i++) {
    $color = $colors[$i-1]
    $label = $labels[$i-1]
    $url = "https://dummyimage.com/800x600/${color.Replace('#', '').Split(',')[0]}/ffffff&text=Villa+$i+-+$label"
    
    $html += @"
        <div class="image-item">
            <img src="$url" alt="Villa $i - $label">
            <div class="caption">Villa $i - $label</div>
        </div>
"@
}

$html += @"
    </div>
    <p>For your code, use these paths in your React components:</p>
    <ul>
"@

for ($i = 1; $i -le 6; $i++) {
    $html += @"
        <li><code>/images/villa-$i.jpg</code> - Villa $i - $($labels[$i-1])</li>
"@
}

$html += @"
    </ul>
</body>
</html>
"@

$html | Out-File -FilePath "public/placeholder-gallery.html" -Encoding utf8
Write-Host "Created placeholder gallery HTML file at public/placeholder-gallery.html" 
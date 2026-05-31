#!/bin/bash
DEPLOYPATH="$1"
cat > "$DEPLOYPATH/.htaccess" << 'HTEOF'
PassengerEnabled off

Options -MultiViews -Indexes
DirectorySlash Off

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Serve real files directly (_next, images, etc.)
    RewriteCond %{REQUEST_FILENAME} -f
    RewriteRule ^ - [L]

    # Explicit page rewrites
    RewriteRule ^portal/?$ /portal.html [L]
    RewriteRule ^about/?$ /about.html [L]
    RewriteRule ^services/?$ /services.html [L]
    RewriteRule ^projects/?$ /projects.html [L]
    RewriteRule ^contact/?$ /contact.html [L]
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>
HTEOF
echo ".htaccess written to $DEPLOYPATH"

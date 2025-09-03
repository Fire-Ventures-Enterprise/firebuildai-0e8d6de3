#!/bin/bash

# Navigation Link Crawler Script
# Crawls all public-facing links to ensure no broken links

echo "🔍 Starting Navigation Link Crawl..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Base URL (update with your actual URL)
BASE_URL="${1:-https://yourapp.lovable.app}"

echo "Crawling: $BASE_URL"
echo ""

# Install linkinator if not present
if ! command -v linkinator &> /dev/null; then
    echo "📦 Installing linkinator..."
    npm install -g linkinator
fi

# Function to crawl and report
crawl_section() {
    local url=$1
    local name=$2
    local options=$3
    
    echo "📍 Checking $name..."
    echo "   URL: $url"
    
    # Run linkinator with options
    linkinator "$url" \
        --recurse \
        --skip ".*\.(jpg|jpeg|gif|png|svg|ico|webp|woff|woff2|ttf|eot|pdf)$" \
        --skip "mailto:" \
        --skip "tel:" \
        --skip "javascript:" \
        --timeout 30000 \
        --format json \
        $options > "/tmp/linkinator-$name.json" 2>&1
    
    # Check results
    if [ $? -eq 0 ]; then
        echo -e "   ${GREEN}✅ All links valid${NC}"
    else
        echo -e "   ${RED}❌ Found broken links${NC}"
        # Parse and display broken links
        cat "/tmp/linkinator-$name.json" | jq -r '.links[] | select(.state == "BROKEN") | "\(.url) -> \(.status)"' 2>/dev/null
    fi
    echo ""
}

# Crawl different sections
echo "🌐 Marketing Site"
echo "-----------------"
crawl_section "$BASE_URL" "marketing" "--skip '/app/'"

echo "📱 Portal Pages"
echo "---------------"
crawl_section "$BASE_URL/portal/estimate/test-token" "estimate-portal" "--no-recurse"
crawl_section "$BASE_URL/portal/invoice/test-token" "invoice-portal" "--no-recurse"

echo "🔄 Legacy Redirects"
echo "-------------------"
# Test specific legacy URLs
LEGACY_URLS=(
    "/finance/po"
    "/app/quotes"
    "/jobs/new"
    "/dashboard"
    "/app/crew"
)

for url in "${LEGACY_URLS[@]}"; do
    full_url="$BASE_URL$url"
    response=$(curl -s -o /dev/null -w "%{http_code}" -L "$full_url")
    if [ "$response" = "200" ]; then
        echo -e "   ${GREEN}✅${NC} $url -> Redirected successfully"
    else
        echo -e "   ${RED}❌${NC} $url -> Failed (HTTP $response)"
    fi
done

echo ""
echo "📊 Summary Report"
echo "=================="

# Count broken links
BROKEN_COUNT=0
for file in /tmp/linkinator-*.json; do
    if [ -f "$file" ]; then
        count=$(cat "$file" | jq '[.links[] | select(.state == "BROKEN")] | length' 2>/dev/null || echo 0)
        BROKEN_COUNT=$((BROKEN_COUNT + count))
    fi
done

if [ $BROKEN_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ All navigation links are working!${NC}"
    echo "   No broken links found."
    exit 0
else
    echo -e "${RED}❌ Found $BROKEN_COUNT broken links${NC}"
    echo "   Please review the errors above."
    exit 1
fi
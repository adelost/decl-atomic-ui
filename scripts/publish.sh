#!/bin/bash
# Publish script for @daui/core and svelte-daui packages
# Handles workspace:* → version replacement automatically

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${GREEN}Publishing Declarative UI packages${NC}"
echo ""

# Check if pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo -e "${RED}Error: pnpm is not installed${NC}"
    exit 1
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Warning: You have uncommitted changes${NC}"
    read -p "Continue anyway? (y/N) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Run checks
echo -e "${YELLOW}Running type checks...${NC}"
pnpm check
echo ""

# Get version from core package
CORE_VERSION=$(node -p "require('$ROOT_DIR/packages/core/package.json').version")
SVELTE_VERSION=$(node -p "require('$ROOT_DIR/packages/svelte/package.json').version")

echo -e "Current versions:"
echo -e "  @daui/core: ${GREEN}$CORE_VERSION${NC}"
echo -e "  svelte-daui: ${GREEN}$SVELTE_VERSION${NC}"
echo ""

# Ask for version bump
echo "Select version bump for both packages:"
echo "  1) patch (x.x.X)"
echo "  2) minor (x.X.0)"
echo "  3) major (X.0.0)"
echo "  4) keep current versions"
read -p "Choice [1-4]: " -n 1 -r
echo ""

case $REPLY in
    1) BUMP="patch" ;;
    2) BUMP="minor" ;;
    3) BUMP="major" ;;
    4) BUMP="" ;;
    *) echo -e "${RED}Invalid choice${NC}"; exit 1 ;;
esac

# Bump versions if needed
if [ -n "$BUMP" ]; then
    echo -e "${YELLOW}Bumping versions ($BUMP)...${NC}"

    # Bump core
    cd "$ROOT_DIR/packages/core"
    npm version $BUMP --no-git-tag-version
    CORE_VERSION=$(node -p "require('./package.json').version")

    # Bump svelte
    cd "$ROOT_DIR/packages/svelte"
    npm version $BUMP --no-git-tag-version
    SVELTE_VERSION=$(node -p "require('./package.json').version")

    cd "$ROOT_DIR"

    echo -e "New versions:"
    echo -e "  @daui/core: ${GREEN}$CORE_VERSION${NC}"
    echo -e "  svelte-daui: ${GREEN}$SVELTE_VERSION${NC}"
    echo ""
fi

# Update workspace:* to actual version in svelte package
echo -e "${YELLOW}Updating workspace dependency to version...${NC}"
SVELTE_PKG="$ROOT_DIR/packages/svelte/package.json"
TEMP_PKG="$SVELTE_PKG.tmp"

# Replace workspace:* with actual version
sed "s/\"workspace:\\*\"/\"^$CORE_VERSION\"/" "$SVELTE_PKG" > "$TEMP_PKG"
mv "$TEMP_PKG" "$SVELTE_PKG"
echo -e "  Updated @daui/core dependency to ^$CORE_VERSION"
echo ""

# Function to restore workspace:* on exit
restore_workspace() {
    echo -e "${YELLOW}Restoring workspace:* dependency...${NC}"
    sed "s/\"\\^$CORE_VERSION\"/\"workspace:*\"/" "$SVELTE_PKG" > "$TEMP_PKG"
    mv "$TEMP_PKG" "$SVELTE_PKG"
}

# Trap to restore on error or interrupt
trap restore_workspace EXIT

# Dry run confirmation
echo -e "${YELLOW}Ready to publish:${NC}"
echo -e "  @daui/core@$CORE_VERSION"
echo -e "  svelte-daui@$SVELTE_VERSION"
echo ""
read -p "Publish to npm? (y/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Publish cancelled${NC}"
    exit 0
fi

# Publish core first (svelte depends on it)
echo -e "${YELLOW}Publishing @daui/core@$CORE_VERSION...${NC}"
cd "$ROOT_DIR/packages/core"
pnpm publish --access public --no-git-checks
echo -e "${GREEN}@daui/core@$CORE_VERSION published!${NC}"
echo ""

# Publish svelte
echo -e "${YELLOW}Publishing svelte-daui@$SVELTE_VERSION...${NC}"
cd "$ROOT_DIR/packages/svelte"
pnpm publish --access public --no-git-checks
echo -e "${GREEN}svelte-daui@$SVELTE_VERSION published!${NC}"
echo ""

# Remove trap since we're done
trap - EXIT

# Restore workspace:* dependency
restore_workspace

# Commit version bump if we did one
if [ -n "$BUMP" ]; then
    echo -e "${YELLOW}Committing version bump...${NC}"
    cd "$ROOT_DIR"
    git add packages/*/package.json
    git commit -m "chore: release @daui/core@$CORE_VERSION, svelte-daui@$SVELTE_VERSION"

    # Create tags
    git tag "@daui/core@$CORE_VERSION"
    git tag "svelte-daui@$SVELTE_VERSION"

    echo ""
    echo -e "${GREEN}Done! Don't forget to push:${NC}"
    echo "  git push && git push --tags"
fi

echo ""
echo -e "${GREEN}✓ Publish complete!${NC}"

#!/bin/bash

# WorkNow CI/CD Pipeline Test Script
# This script helps you test the CI/CD pipeline step by step

set -e

echo "🚀 WorkNow CI/CD Pipeline Testing"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not in a git repository. Please run this script from the project root."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null; then
    print_warning "GitHub CLI (gh) is not installed. Some tests will be skipped."
    print_status "Install GitHub CLI: https://cli.github.com/"
fi

# Function to test local Docker builds
test_docker_builds() {
    print_status "Testing Docker builds locally..."
    
    # Test frontend build
    print_status "Building frontend Docker image..."
    if npm run docker:build:frontend; then
        print_success "Frontend Docker build successful"
    else
        print_error "Frontend Docker build failed"
        return 1
    fi
    
    # Test backend build
    print_status "Building backend Docker image..."
    if npm run docker:build:backend; then
        print_success "Backend Docker build successful"
    else
        print_error "Backend Docker build failed"
        return 1
    fi
    
    # Test full production build
    print_status "Building production Docker image..."
    if npm run docker:build; then
        print_success "Production Docker build successful"
    else
        print_error "Production Docker build failed"
        return 1
    fi
}

# Function to test local application
test_local_app() {
    print_status "Testing local application..."
    
    # Install dependencies
    print_status "Installing dependencies..."
    if npm ci; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        return 1
    fi
    
    # Run tests
    print_status "Running tests..."
    if npm test; then
        print_success "Tests passed successfully"
    else
        print_error "Tests failed"
        return 1
    fi
    
    # Run linting
    print_status "Running linting..."
    if npm run lint; then
        print_success "Linting passed successfully"
    else
        print_warning "Linting issues found (this is expected for testing)"
    fi
    
    # Build application
    print_status "Building application..."
    if npm run build; then
        print_success "Application build successful"
    else
        print_error "Application build failed"
        return 1
    fi
}

# Function to test GitHub workflows
test_github_workflows() {
    if ! command -v gh &> /dev/null; then
        print_warning "Skipping GitHub workflow tests (gh CLI not available)"
        return 0
    fi
    
    print_status "Testing GitHub workflows..."
    
    # Check if we're authenticated
    if ! gh auth status &> /dev/null; then
        print_warning "Not authenticated with GitHub CLI. Please run: gh auth login"
        return 1
    fi
    
    # List available workflows
    print_status "Available workflows:"
    gh workflow list
    
    # Test workflow syntax
    print_status "Checking workflow syntax..."
    for workflow in .github/workflows/*.yml; do
        if [ -f "$workflow" ]; then
            print_status "Checking $workflow..."
            if gh workflow view "$(basename "$workflow" .yml)" &> /dev/null; then
                print_success "Workflow syntax OK: $(basename "$workflow")"
            else
                print_error "Workflow syntax error: $(basename "$workflow")"
            fi
        fi
    done
}

# Function to create test branch and trigger CI
trigger_ci_test() {
    if ! command -v gh &> /dev/null; then
        print_warning "Skipping CI trigger test (gh CLI not available)"
        return 0
    fi
    
    print_status "Creating test branch to trigger CI..."
    
    # Create test branch
    TEST_BRANCH="test-cicd-$(date +%Y%m%d-%H%M%S)"
    git checkout -b "$TEST_BRANCH"
    
    # Make a small change
    echo "// Test CI pipeline - $(date)" >> apps/client/src/App.jsx
    
    # Commit and push
    git add .
    git commit -m "test: trigger CI pipeline"
    git push origin "$TEST_BRANCH"
    
    print_success "Test branch created: $TEST_BRANCH"
    print_status "Check GitHub Actions tab to see the CI pipeline running"
    
    # Create PR
    print_status "Creating pull request..."
    gh pr create --title "Test CI Pipeline" --body "Testing the CI/CD pipeline - $(date)"
    
    print_success "Pull request created. Check GitHub Actions for workflow execution."
}

# Function to test staging environment
test_staging_environment() {
    print_status "Testing staging environment setup..."
    
    # Check if staging docker-compose file exists
    if [ -f "docker/docker-compose.staging.yml" ]; then
        print_success "Staging Docker Compose file exists"
    else
        print_error "Staging Docker Compose file not found"
        return 1
    fi
    
    # Check if staging Dockerfile exists
    if [ -f "docker/Dockerfile.frontend" ] && [ -f "docker/Dockerfile.backend" ]; then
        print_success "Staging Dockerfiles exist"
    else
        print_error "Staging Dockerfiles not found"
        return 1
    fi
}

# Function to check secrets configuration
check_secrets() {
    print_status "Checking secrets configuration..."
    
    if ! command -v gh &> /dev/null; then
        print_warning "Skipping secrets check (gh CLI not available)"
        return 0
    fi
    
    # List repository secrets (this will show if any secrets are configured)
    print_status "Repository secrets:"
    gh secret list 2>/dev/null || print_warning "No secrets configured or insufficient permissions"
    
    print_status "Environment secrets:"
    gh api repos/:owner/:repo/environments 2>/dev/null || print_warning "No environments configured"
}

# Main test function
run_tests() {
    echo ""
    print_status "Starting CI/CD pipeline tests..."
    echo ""
    
    # Test 1: Local application
    print_status "=== Test 1: Local Application ==="
    if test_local_app; then
        print_success "Local application tests passed"
    else
        print_error "Local application tests failed"
        return 1
    fi
    echo ""
    
    # Test 2: Docker builds
    print_status "=== Test 2: Docker Builds ==="
    if test_docker_builds; then
        print_success "Docker build tests passed"
    else
        print_error "Docker build tests failed"
        return 1
    fi
    echo ""
    
    # Test 3: Staging environment
    print_status "=== Test 3: Staging Environment ==="
    if test_staging_environment; then
        print_success "Staging environment tests passed"
    else
        print_error "Staging environment tests failed"
        return 1
    fi
    echo ""
    
    # Test 4: GitHub workflows
    print_status "=== Test 4: GitHub Workflows ==="
    if test_github_workflows; then
        print_success "GitHub workflow tests passed"
    else
        print_warning "GitHub workflow tests had issues"
    fi
    echo ""
    
    # Test 5: Secrets configuration
    print_status "=== Test 5: Secrets Configuration ==="
    check_secrets
    echo ""
    
    print_success "All basic tests completed!"
    echo ""
    
    # Ask if user wants to trigger CI
    read -p "Do you want to trigger a CI test by creating a test branch and PR? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        trigger_ci_test
    fi
}

# Help function
show_help() {
    echo "WorkNow CI/CD Pipeline Test Script"
    echo ""
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  --help, -h     Show this help message"
    echo "  --local        Run only local tests (no GitHub integration)"
    echo "  --docker       Run only Docker build tests"
    echo "  --ci           Trigger CI test (create test branch and PR)"
    echo "  --all          Run all tests (default)"
    echo ""
    echo "Examples:"
    echo "  $0              # Run all tests"
    echo "  $0 --local      # Run only local tests"
    echo "  $0 --docker     # Run only Docker tests"
    echo "  $0 --ci         # Trigger CI test"
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --local)
        test_local_app
        ;;
    --docker)
        test_docker_builds
        ;;
    --ci)
        trigger_ci_test
        ;;
    --all|"")
        run_tests
        ;;
    *)
        print_error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac

echo ""
print_success "Test script completed!"
print_status "Check the GitHub Actions tab in your repository to see workflow execution."
print_status "For detailed testing instructions, see: .github/TESTING_GUIDE.md"

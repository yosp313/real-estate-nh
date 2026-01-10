#!/bin/bash
# =============================================================================
# EC2 Deployment Diagnostic Script
# Run this on your EC2 instance to diagnose connection issues
# =============================================================================

echo "🔍 Al-Nader Real Estate - EC2 Diagnostics"
echo "==========================================="
echo ""

# Check Docker
echo "1. Docker Status:"
if command -v docker &> /dev/null; then
    echo "   ✅ Docker is installed"
    docker --version
else
    echo "   ❌ Docker is NOT installed"
    exit 1
fi
echo ""

# Check Docker Compose
echo "2. Docker Compose Status:"
if command -v docker compose &> /dev/null; then
    echo "   ✅ Docker Compose is available"
else
    echo "   ❌ Docker Compose is NOT available"
fi
echo ""

# Check container status
echo "3. Container Status:"
docker compose ps 2>/dev/null || echo "   ⚠️  Not in project directory or no containers"
echo ""

# Check if container is running
echo "4. Running Containers:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Check what's listening on ports
echo "5. Listening Ports:"
if command -v netstat &> /dev/null; then
    netstat -tlnp 2>/dev/null | grep -E ":80|:8080" || echo "   No services on port 80/8080"
elif command -v ss &> /dev/null; then
    ss -tlnp | grep -E ":80|:8080" || echo "   No services on port 80/8080"
fi
echo ""

# Test localhost
echo "6. Local Connection Test:"
if curl -sf http://localhost:8080/up > /dev/null 2>&1; then
    echo "   ✅ App responds on localhost:8080"
elif curl -sf http://localhost:80/up > /dev/null 2>&1; then
    echo "   ✅ App responds on localhost:80"
elif curl -sf http://localhost:8080 > /dev/null 2>&1; then
    echo "   ✅ App responds on localhost:8080 (but /up endpoint may not exist)"
else
    echo "   ❌ App does NOT respond on localhost"
    echo "   Checking container logs..."
    docker compose logs --tail=20 app 2>/dev/null
fi
echo ""

# Check firewall
echo "7. Firewall Status:"
if command -v ufw &> /dev/null; then
    sudo ufw status 2>/dev/null || echo "   UFW not active or no sudo"
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-all 2>/dev/null || echo "   Firewalld not active or no sudo"
else
    echo "   No common firewall detected (check iptables or AWS Security Groups)"
fi
echo ""

# Get public IP
echo "8. Public IP:"
PUBLIC_IP=$(curl -sf http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null)
if [ -n "$PUBLIC_IP" ]; then
    echo "   Your EC2 public IP: $PUBLIC_IP"
    echo "   Access URL: http://$PUBLIC_IP:8080"
else
    echo "   Could not determine public IP (are you on EC2?)"
fi
echo ""

# Security group reminder
echo "9. AWS Security Group Reminder:"
echo "   Make sure your EC2 Security Group has an inbound rule:"
echo "   - Type: Custom TCP"
echo "   - Port: 8080 (or 80 if using that)"
echo "   - Source: 0.0.0.0/0"
echo ""

echo "==========================================="
echo "Diagnostics complete!"

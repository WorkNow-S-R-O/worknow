#!/usr/bin/env node

/**
 * Redis Performance Demonstration for WorkNow
 * This script shows how Redis caching makes your app super fast!
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:3001/api';

async function measureResponseTime(url) {
  const start = Date.now();
  const response = await fetch(url);
  const end = Date.now();
  return { status: response.status, time: end - start };
}

async function demonstrateRedisPerformance() {
  console.log('🚀 REDIS PERFORMANCE DEMONSTRATION');
  console.log('===================================\n');

  // Test 1: First request (cache miss)
  console.log('📊 Test 1: First Request (Cache Miss)');
  const firstRequest = await measureResponseTime(`${API_BASE}/jobs`);
  console.log(`   Status: ${firstRequest.status} | Time: ${firstRequest.time}ms\n`);

  // Test 2: Second request (cache hit)
  console.log('📊 Test 2: Second Request (Cache Hit)');
  const secondRequest = await measureResponseTime(`${API_BASE}/jobs`);
  console.log(`   Status: ${secondRequest.status} | Time: ${secondRequest.time}ms\n`);

  // Test 3: Third request (cache hit)
  console.log('📊 Test 3: Third Request (Cache Hit)');
  const thirdRequest = await measureResponseTime(`${API_BASE}/jobs`);
  console.log(`   Status: ${thirdRequest.status} | Time: ${thirdRequest.time}ms\n`);

  // Calculate performance improvement
  const improvement = ((firstRequest.time - secondRequest.time) / firstRequest.time * 100).toFixed(1);
  const speedup = (firstRequest.time / secondRequest.time).toFixed(1);

  console.log('📈 PERFORMANCE SUMMARY');
  console.log('======================');
  console.log(`⚡ Speed Improvement: ${improvement}% faster`);
  console.log(`🚀 Speed Multiplier: ${speedup}x faster`);
  console.log(`💾 Cache Hit Time: ${secondRequest.time}ms`);
  console.log(`🗄️ Database Query Time: ${firstRequest.time}ms\n`);

  // Test Redis health
  console.log('🔍 Redis Health Check');
  console.log('====================');
  try {
    const healthResponse = await fetch(`${API_BASE}/redis/health`);
    const health = await healthResponse.json();
    console.log(`✅ Status: ${health.status}`);
    console.log(`⚡ Latency: ${health.redis.latency}`);
    console.log(`💾 Memory Used: ${health.redis.memory.split('used_memory_human:')[1]?.split('\n')[0] || 'N/A'}`);
  } catch (error) {
    console.log('❌ Redis health check failed:', error.message);
  }

  console.log('\n🎯 WHY REDIS MAKES YOUR APP SUPER FAST:');
  console.log('=======================================');
  console.log('1. 💾 In-Memory Storage: 100x faster than disk-based databases');
  console.log('2. 🔄 Cache Hits: Avoid expensive database queries');
  console.log('3. 📊 Session Management: Fast user session storage');
  console.log('4. 🛡️ Rate Limiting: Protect your API from abuse');
  console.log('5. 📢 Real-time Features: Instant notifications and updates');
  console.log('6. 🎯 Smart Caching: Cache frequently accessed data');
  console.log('7. ⚡ Low Latency: Sub-millisecond response times');
  console.log('8. 🔧 Automatic Expiration: Fresh data with TTL');
}

// Run the demonstration
demonstrateRedisPerformance().catch(console.error); 
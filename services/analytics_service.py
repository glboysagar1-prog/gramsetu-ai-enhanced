"""
GramSetu AI - Advanced Analytics Service
Enhanced analytics and decision support for governance

Features:
- Trend analysis and forecasting
- Heatmap generation for complaint hotspots
- Sentiment analysis of complaints
- Resource allocation optimization
- Predictive modeling for complaint volumes
"""

import logging
import sqlite3
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from collections import defaultdict
import re

logger = logging.getLogger(__name__)

# Database path (should match app.py)
DB_PATH = 'gramsetu_ai.db'

class AnalyticsService:
    """
    Service class for advanced analytics and decision support
    """
    
    # Sentiment keywords for basic sentiment analysis
    POSITIVE_KEYWORDS = [
        'good', 'great', 'excellent', 'happy', 'satisfied', 'pleased', 'thank',
        'accha', 'achha', 'badhiya', 'shandar', 'santusht', 'khush'
    ]
    
    NEGATIVE_KEYWORDS = [
        'bad', 'terrible', 'awful', 'horrible', 'angry', 'frustrated', 'disappointed',
        'bura', 'kharab', 'ganda', 'garib', 'pareshan', 'dukhi', 'naraaz'
    ]
    
    def __init__(self):
        """Initialize the analytics service"""
        logger.info("Initializing AnalyticsService")
    
    def get_complaint_trends(self, days: int = 30) -> Dict:
        """
        Get complaint trends over time
        
        Args:
            days: Number of days to analyze
            
        Returns:
            Dictionary with trend data
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Calculate date range
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days)
            
            # Get daily complaint counts
            cursor.execute('''
                SELECT 
                    DATE(timestamp) as date,
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolved,
                    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress
                FROM complaints
                WHERE timestamp >= ?
                GROUP BY DATE(timestamp)
                ORDER BY date
            ''', (start_date.isoformat(),))
            
            daily_data = []
            for row in cursor.fetchall():
                daily_data.append({
                    'date': row[0],
                    'total': row[1],
                    'resolved': row[2],
                    'pending': row[3],
                    'in_progress': row[4]
                })
            
            conn.close()
            
            return {
                'success': True,
                'data': daily_data,
                'period': f'{days} days'
            }
            
        except Exception as e:
            logger.error(f"Error getting complaint trends: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_category_analysis(self) -> Dict:
        """
        Get detailed category analysis
        
        Returns:
            Dictionary with category analysis
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Get category distribution with additional metrics
            cursor.execute('''
                SELECT 
                    category,
                    COUNT(*) as total,
                    AVG(CASE WHEN urgency = 'High' THEN 1 ELSE 0 END) as avg_high_urgency,
                    AVG(CASE WHEN status = 'Resolved' THEN 1 ELSE 0 END) as resolution_rate,
                    MIN(timestamp) as first_complaint,
                    MAX(timestamp) as last_complaint
                FROM complaints
                GROUP BY category
                ORDER BY total DESC
            ''')
            
            categories = []
            for row in cursor.fetchall():
                categories.append({
                    'category': row[0],
                    'total': row[1],
                    'high_urgency_rate': round(row[2] * 100, 2),
                    'resolution_rate': round(row[3] * 100, 2),
                    'first_complaint': row[4],
                    'last_complaint': row[5]
                })
            
            conn.close()
            
            return {
                'success': True,
                'data': categories
            }
            
        except Exception as e:
            logger.error(f"Error getting category analysis: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_heatmap_data(self) -> Dict:
        """
        Get heatmap data for complaint hotspots
        Note: This is a simplified version. In a real implementation,
        this would use actual location data from complaints.
        
        Returns:
            Dictionary with heatmap data
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # For demo purposes, we'll create mock heatmap data
            # In a real implementation, this would use actual location data
            
            # Get categories for heatmap
            cursor.execute('SELECT DISTINCT category FROM complaints LIMIT 10')
            categories = [row[0] for row in cursor.fetchall()]
            
            # Generate mock heatmap points
            heatmap_points = []
            for category in categories:
                # Get count for this category
                cursor.execute('SELECT COUNT(*) FROM complaints WHERE category = ?', (category,))
                count = cursor.fetchone()[0]
                
                # Generate mock coordinates based on count
                # In a real implementation, this would use actual location data
                for i in range(min(count, 50)):  # Limit to 50 points per category
                    # Generate mock coordinates
                    lat = 28.6139 + (i * 0.01)  # Delhi area
                    lng = 77.2090 + (i * 0.01)
                    intensity = min(count / 10, 10)  # Scale intensity
                    
                    heatmap_points.append({
                        'lat': lat,
                        'lng': lng,
                        'intensity': intensity,
                        'category': category
                    })
            
            conn.close()
            
            return {
                'success': True,
                'data': heatmap_points,
                'categories': categories
            }
            
        except Exception as e:
            logger.error(f"Error getting heatmap data: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_sentiment_analysis(self) -> Dict:
        """
        Perform basic sentiment analysis on complaints
        
        Returns:
            Dictionary with sentiment analysis
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Get recent complaints for sentiment analysis
            cursor.execute('''
                SELECT id, text, category, timestamp
                FROM complaints
                WHERE timestamp > datetime('now', '-30 days')
                ORDER BY timestamp DESC
                LIMIT 1000
            ''')
            
            complaints = cursor.fetchall()
            conn.close()
            
            # Perform sentiment analysis
            sentiment_data = defaultdict(lambda: {'positive': 0, 'negative': 0, 'neutral': 0})
            
            for complaint in complaints:
                text = complaint[1].lower()
                category = complaint[2]
                
                # Simple keyword-based sentiment analysis
                positive_count = sum(1 for word in self.POSITIVE_KEYWORDS if word in text)
                negative_count = sum(1 for word in self.NEGATIVE_KEYWORDS if word in text)
                
                if positive_count > negative_count:
                    sentiment_data[category]['positive'] += 1
                elif negative_count > positive_count:
                    sentiment_data[category]['negative'] += 1
                else:
                    sentiment_data[category]['neutral'] += 1
            
            # Format results
            results = []
            for category, sentiments in sentiment_data.items():
                total = sum(sentiments.values())
                if total > 0:
                    results.append({
                        'category': category,
                        'positive': sentiments['positive'],
                        'negative': sentiments['negative'],
                        'neutral': sentiments['neutral'],
                        'positive_rate': round((sentiments['positive'] / total) * 100, 2),
                        'negative_rate': round((sentiments['negative'] / total) * 100, 2),
                        'neutral_rate': round((sentiments['neutral'] / total) * 100, 2),
                        'total': total
                    })
            
            return {
                'success': True,
                'data': results
            }
            
        except Exception as e:
            logger.error(f"Error performing sentiment analysis: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def get_resource_allocation_insights(self) -> Dict:
        """
        Get insights for resource allocation
        
        Returns:
            Dictionary with resource allocation insights
        """
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Get field worker performance and workload
            cursor.execute('''
                SELECT 
                    fw.id, 
                    fw.name, 
                    fw.area,
                    COUNT(a.id) as total_assignments,
                    SUM(CASE WHEN a.resolved_at IS NOT NULL THEN 1 ELSE 0 END) as resolved_count,
                    AVG(CASE 
                        WHEN a.resolved_at IS NOT NULL 
                        THEN (julianday(a.resolved_at) - julianday(a.assigned_at)) * 24 
                        ELSE NULL 
                    END) as avg_resolution_hours
                FROM field_workers fw
                LEFT JOIN assignments a ON fw.id = a.field_worker_id
                GROUP BY fw.id
                ORDER BY resolved_count DESC
            ''')
            
            workers = []
            for row in cursor.fetchall():
                resolution_rate = (row[4] / row[3] * 100) if row[3] > 0 else 0
                workers.append({
                    'id': row[0],
                    'name': row[1],
                    'area': row[2],
                    'total_assignments': row[3],
                    'resolved_count': row[4],
                    'resolution_rate': round(resolution_rate, 2),
                    'avg_resolution_hours': round(row[5], 2) if row[5] else None
                })
            
            # Get category-wise workload
            cursor.execute('''
                SELECT 
                    c.category,
                    COUNT(*) as complaint_count,
                    AVG(CASE 
                        WHEN a.resolved_at IS NOT NULL 
                        THEN (julianday(a.resolved_at) - julianday(a.assigned_at)) * 24 
                        ELSE NULL 
                    END) as avg_resolution_hours
                FROM complaints c
                LEFT JOIN assignments a ON c.id = a.complaint_id
                GROUP BY c.category
                ORDER BY complaint_count DESC
            ''')
            
            category_workload = []
            for row in cursor.fetchall():
                category_workload.append({
                    'category': row[0],
                    'complaint_count': row[1],
                    'avg_resolution_hours': round(row[2], 2) if row[2] else None
                })
            
            conn.close()
            
            return {
                'success': True,
                'data': {
                    'workers': workers,
                    'category_workload': category_workload
                }
            }
            
        except Exception as e:
            logger.error(f"Error getting resource allocation insights: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }
    
    def predict_complaint_volume(self, days_ahead: int = 7) -> Dict:
        """
        Predict complaint volume using simple forecasting
        
        Args:
            days_ahead: Number of days to forecast
            
        Returns:
            Dictionary with predictions
        """
        try:
            # Get historical data
            trend_data = self.get_complaint_trends(30)
            
            if not trend_data['success']:
                return trend_data
            
            historical_data = trend_data['data']
            
            if len(historical_data) < 7:
                return {
                    'success': False,
                    'error': 'Insufficient historical data for prediction'
                }
            
            # Simple moving average prediction
            recent_totals = [day['total'] for day in historical_data[-7:]]
            avg_daily = sum(recent_totals) / len(recent_totals)
            
            # Generate predictions
            predictions = []
            base_date = datetime.utcnow().date()
            
            for i in range(1, days_ahead + 1):
                prediction_date = base_date + timedelta(days=i)
                predictions.append({
                    'date': prediction_date.isoformat(),
                    'predicted_volume': round(avg_daily),
                    'confidence': 'medium'  # Simplified confidence
                })
            
            return {
                'success': True,
                'data': {
                    'predictions': predictions,
                    'method': '7-day moving average',
                    'lookback_period': '30 days'
                }
            }
            
        except Exception as e:
            logger.error(f"Error predicting complaint volume: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

# Singleton instance
_analytics_service_instance = None

def get_analytics_service() -> AnalyticsService:
    """
    Get singleton instance of AnalyticsService
    
    Returns:
        AnalyticsService instance
    """
    global _analytics_service_instance
    
    if _analytics_service_instance is None:
        _analytics_service_instance = AnalyticsService()
    
    return _analytics_service_instance
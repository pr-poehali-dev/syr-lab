import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def handler(event: dict, context) -> dict:
    """API для управления заказами"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            order_id = event.get('queryStringParameters', {}).get('id') if event.get('queryStringParameters') else None
            user_id = event.get('queryStringParameters', {}).get('user_id') if event.get('queryStringParameters') else None
            
            if order_id:
                cur.execute('''
                    SELECT o.*, 
                           json_agg(
                               json_build_object(
                                   'id', oi.id,
                                   'product_name', oi.product_name,
                                   'product_price', oi.product_price,
                                   'quantity', oi.quantity
                               )
                           ) as items
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    WHERE o.id = %s
                    GROUP BY o.id
                ''', (order_id,))
                order = cur.fetchone()
                result = dict(order) if order else None
            elif user_id:
                cur.execute('''
                    SELECT o.*, 
                           json_agg(
                               json_build_object(
                                   'id', oi.id,
                                   'product_name', oi.product_name,
                                   'product_price', oi.product_price,
                                   'quantity', oi.quantity
                               )
                           ) as items
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    WHERE o.user_id = %s
                    GROUP BY o.id
                    ORDER BY o.created_at DESC
                ''', (user_id,))
                orders = cur.fetchall()
                result = [dict(row) for row in orders]
            else:
                cur.execute('''
                    SELECT o.*, 
                           json_agg(
                               json_build_object(
                                   'id', oi.id,
                                   'product_name', oi.product_name,
                                   'product_price', oi.product_price,
                                   'quantity', oi.quantity
                               )
                           ) as items
                    FROM orders o
                    LEFT JOIN order_items oi ON o.id = oi.order_id
                    GROUP BY o.id
                    ORDER BY o.created_at DESC
                ''')
                orders = cur.fetchall()
                result = [dict(row) for row in orders]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            data = json.loads(event.get('body', '{}'))
            
            cur.execute(
                '''
                INSERT INTO orders (user_id, total_price, delivery_type, payment_type, address, comment, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id
                ''',
                (
                    data.get('user_id'),
                    data['total_price'],
                    data['delivery_type'],
                    data['payment_type'],
                    data.get('address', ''),
                    data.get('comment', ''),
                    'new'
                )
            )
            
            order_id = cur.fetchone()['id']
            
            for item in data.get('items', []):
                cur.execute(
                    '''
                    INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity)
                    VALUES (%s, %s, %s, %s, %s)
                    ''',
                    (
                        order_id,
                        item['product_id'],
                        item['product_name'],
                        item['product_price'],
                        item['quantity']
                    )
                )
            
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'id': order_id, 'status': 'new'}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            order_id = data.get('id')
            new_status = data.get('status')
            
            if not order_id or not new_status:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Order ID and status are required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                '''
                UPDATE orders 
                SET status = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                ''',
                (new_status, order_id)
            )
            
            updated_order = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(updated_order) if updated_order else None, default=str),
                'isBase64Encoded': False
            }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

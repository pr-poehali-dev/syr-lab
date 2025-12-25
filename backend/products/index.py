import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления товарами сыроварни"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            product_id = event.get('queryStringParameters', {}).get('id') if event.get('queryStringParameters') else None
            
            if product_id:
                cur.execute('SELECT * FROM products WHERE id = %s', (product_id,))
                product = cur.fetchone()
                result = dict(product) if product else None
            else:
                cur.execute('SELECT * FROM products ORDER BY id')
                products = cur.fetchall()
                result = [dict(row) for row in products]
            
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
                """
                INSERT INTO products (name, description, price, weight, image, category)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (
                    data['name'],
                    data.get('description', ''),
                    data['price'],
                    data['weight'],
                    data.get('image', ''),
                    data.get('category', '')
                )
            )
            
            new_product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(new_product), default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            product_id = data.get('id')
            
            if not product_id:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Product ID is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                UPDATE products 
                SET name = %s, description = %s, price = %s, weight = %s, 
                    image = %s, category = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
                """,
                (
                    data['name'],
                    data.get('description', ''),
                    data['price'],
                    data['weight'],
                    data.get('image', ''),
                    data.get('category', ''),
                    product_id
                )
            )
            
            updated_product = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(updated_product) if updated_product else None, default=str),
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

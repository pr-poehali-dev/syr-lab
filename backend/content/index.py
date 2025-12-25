import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    """API для управления контентом сайта"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
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
            section = event.get('queryStringParameters', {}).get('section') if event.get('queryStringParameters') else None
            
            if section:
                cur.execute('SELECT * FROM site_content WHERE section = %s', (section,))
                content = cur.fetchone()
                result = dict(content) if content else None
            else:
                cur.execute('SELECT * FROM site_content ORDER BY id')
                contents = cur.fetchall()
                result = [dict(row) for row in contents]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(result, default=str),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            data = json.loads(event.get('body', '{}'))
            section = data.get('section')
            
            if not section:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Section is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute(
                """
                INSERT INTO site_content (section, title, subtitle, content)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT (section) 
                DO UPDATE SET 
                    title = EXCLUDED.title,
                    subtitle = EXCLUDED.subtitle,
                    content = EXCLUDED.content,
                    updated_at = CURRENT_TIMESTAMP
                RETURNING *
                """,
                (
                    section,
                    data.get('title', ''),
                    data.get('subtitle', ''),
                    data.get('content', '')
                )
            )
            
            updated_content = cur.fetchone()
            conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(dict(updated_content), default=str),
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

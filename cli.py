#!/usr/bin/env python3
"""
Command-line interface for managing Icelandic municipalities (sveitarfélög).
"""
import sys
import argparse
from sveitarfelag import Sveitarfelag, SveitarfelagManager


def main():
    parser = argparse.ArgumentParser(description='Manage Icelandic municipalities (sveitarfélög)')
    parser.add_argument('--storage', default='sveitarfelog.json', help='Storage file path')
    
    subparsers = parser.add_subparsers(dest='command', help='Available commands')
    
    # Add command
    add_parser = subparsers.add_parser('add', help='Add a new municipality')
    add_parser.add_argument('name', help='Municipality name')
    add_parser.add_argument('population', type=int, help='Population')
    add_parser.add_argument('region', help='Region name')
    add_parser.add_argument('--id', help='Custom ID (optional)')
    
    # List command
    subparsers.add_parser('list', help='List all municipalities')
    
    # Get command
    get_parser = subparsers.add_parser('get', help='Get a municipality by ID')
    get_parser.add_argument('id', help='Municipality ID')
    
    # Update command
    update_parser = subparsers.add_parser('update', help='Update a municipality')
    update_parser.add_argument('id', help='Municipality ID')
    update_parser.add_argument('--name', help='New name')
    update_parser.add_argument('--population', type=int, help='New population')
    update_parser.add_argument('--region', help='New region')
    
    # Delete command
    delete_parser = subparsers.add_parser('delete', help='Delete a municipality')
    delete_parser.add_argument('id', help='Municipality ID')
    
    # Search command
    search_parser = subparsers.add_parser('search', help='Search municipalities')
    search_parser.add_argument('query', help='Search query')
    
    args = parser.parse_args()
    
    if not args.command:
        parser.print_help()
        return 1
    
    manager = SveitarfelagManager(args.storage)
    
    try:
        if args.command == 'add':
            sveitarfelag = Sveitarfelag(
                name=args.name,
                population=args.population,
                region=args.region,
                id=args.id
            )
            manager.add(sveitarfelag)
            print(f"Added municipality: {sveitarfelag.name} (ID: {sveitarfelag.id})")
        
        elif args.command == 'list':
            sveitarfelog = manager.list_all()
            if not sveitarfelog:
                print("No municipalities found.")
            else:
                print(f"\n{'Name':<30} {'Population':<15} {'Region':<20} {'ID'}")
                print("-" * 80)
                for s in sveitarfelog:
                    print(f"{s.name:<30} {s.population:<15} {s.region:<20} {s.id}")
        
        elif args.command == 'get':
            sveitarfelag = manager.get(args.id)
            if sveitarfelag:
                print(f"\nName:       {sveitarfelag.name}")
                print(f"Population: {sveitarfelag.population}")
                print(f"Region:     {sveitarfelag.region}")
                print(f"ID:         {sveitarfelag.id}")
            else:
                print(f"Municipality with ID '{args.id}' not found.")
                return 1
        
        elif args.command == 'update':
            updates = {}
            if args.name:
                updates['name'] = args.name
            if args.population is not None:
                updates['population'] = args.population
            if args.region:
                updates['region'] = args.region
            
            if not updates:
                print("No updates specified. Use --name, --population, or --region.")
                return 1
            
            manager.update(args.id, **updates)
            print(f"Updated municipality with ID '{args.id}'")
        
        elif args.command == 'delete':
            manager.delete(args.id)
            print(f"Deleted municipality with ID '{args.id}'")
        
        elif args.command == 'search':
            results = manager.search(args.query)
            if not results:
                print(f"No municipalities found matching '{args.query}'.")
            else:
                print(f"\nFound {len(results)} municipality/municipalities:\n")
                print(f"{'Name':<30} {'Population':<15} {'Region':<20} {'ID'}")
                print("-" * 80)
                for s in results:
                    print(f"{s.name:<30} {s.population:<15} {s.region:<20} {s.id}")
        
        return 0
    
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())

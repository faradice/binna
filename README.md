# binna

Sveitarfélög (Municipality) Management System

A simple Python-based system for managing Icelandic municipalities (sveitarfélög).

## Features

- Add, list, get, update, and delete municipalities
- Search municipalities by name or region
- JSON-based persistent storage
- Command-line interface

## Installation

No external dependencies required. Uses only Python standard library (Python 3.7+).

## Usage

### Command-Line Interface

Add a municipality:
```bash
python cli.py add "Reykjavík" 131136 "Höfuðborgarsvæðið"
```

List all municipalities:
```bash
python cli.py list
```

Get a specific municipality:
```bash
python cli.py get reykjavik
```

Update a municipality:
```bash
python cli.py update reykjavik --population 135000
```

Search municipalities:
```bash
python cli.py search "Reykja"
```

Delete a municipality:
```bash
python cli.py delete reykjavik
```

### Python API

```python
from sveitarfelag import Sveitarfelag, SveitarfelagManager

# Create manager
manager = SveitarfelagManager()

# Add municipality
sveitarfelag = Sveitarfelag(
    name="Reykjavík",
    population=131136,
    region="Höfuðborgarsvæðið"
)
manager.add(sveitarfelag)

# List all
for s in manager.list_all():
    print(f"{s.name}: {s.population} people")

# Search
results = manager.search("Reykja")
```

## Testing

Run the test suite:
```bash
python -m unittest test_sveitarfelag.py
```

## Data Storage

Municipality data is stored in `sveitarfelog.json` by default. You can specify a custom storage location:
```bash
python cli.py --storage /path/to/data.json list
```
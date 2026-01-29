"""
Sveitarfélag (Municipality) data model and management system.
"""
import json
import unicodedata
from typing import Optional, List, Dict
from dataclasses import dataclass, asdict


def normalize_id(text: str) -> str:
    """Normalize text for use as an ID by removing diacritics and converting to lowercase."""
    # Normalize unicode characters
    nfd = unicodedata.normalize('NFD', text)
    # Remove diacritics (combining characters)
    without_diacritics = ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    # Convert to lowercase and replace spaces and special chars
    normalized = without_diacritics.lower().replace(' ', '_').replace('ð', 'd').replace('þ', 'th').replace('æ', 'ae')
    return normalized


@dataclass
class Sveitarfelag:
    """Represents an Icelandic municipality (sveitarfélag)."""
    name: str
    population: int
    region: str
    id: Optional[str] = None
    
    def __post_init__(self):
        # Validate inputs
        if not self.name or not self.name.strip():
            raise ValueError("Municipality name cannot be empty")
        if not self.region or not self.region.strip():
            raise ValueError("Region cannot be empty")
        if self.population <= 0:
            raise ValueError("Population must be a positive integer")
        
        if self.id is None:
            # Generate a simple ID from name if not provided
            self.id = normalize_id(self.name)
    
    def to_dict(self) -> Dict:
        """Convert to dictionary."""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: Dict) -> 'Sveitarfelag':
        """Create instance from dictionary."""
        return cls(**data)


class SveitarfelagManager:
    """Manages a collection of municipalities."""
    
    def __init__(self, storage_file: str = "sveitarfelog.json"):
        self.storage_file = storage_file
        self.sveitarfelog: Dict[str, Sveitarfelag] = {}
        self.load()
    
    def add(self, sveitarfelag: Sveitarfelag) -> None:
        """Add a municipality."""
        if sveitarfelag.id in self.sveitarfelog:
            raise ValueError(f"Municipality with id '{sveitarfelag.id}' already exists")
        self.sveitarfelog[sveitarfelag.id] = sveitarfelag
        self.save()
    
    def get(self, municipality_id: str) -> Optional[Sveitarfelag]:
        """Get a municipality by ID."""
        return self.sveitarfelog.get(municipality_id)
    
    def update(self, municipality_id: str, **kwargs) -> None:
        """Update a municipality."""
        if municipality_id not in self.sveitarfelog:
            raise ValueError(f"Municipality with id '{municipality_id}' not found")
        
        sveitarfelag = self.sveitarfelog[municipality_id]
        valid_attrs = {'name', 'population', 'region'}
        invalid_attrs = set(kwargs.keys()) - valid_attrs
        if invalid_attrs:
            raise ValueError(f"Invalid attributes: {', '.join(invalid_attrs)}. Valid attributes are: {', '.join(valid_attrs)}")
        
        for key, value in kwargs.items():
            if key == 'name' and (not value or not value.strip()):
                raise ValueError("Municipality name cannot be empty")
            elif key == 'region' and (not value or not value.strip()):
                raise ValueError("Region cannot be empty")
            elif key == 'population' and value <= 0:
                raise ValueError("Population must be a positive integer")
            setattr(sveitarfelag, key, value)
        self.save()
    
    def delete(self, municipality_id: str) -> None:
        """Delete a municipality."""
        if municipality_id not in self.sveitarfelog:
            raise ValueError(f"Municipality with id '{municipality_id}' not found")
        del self.sveitarfelog[municipality_id]
        self.save()
    
    def list_all(self) -> List[Sveitarfelag]:
        """List all municipalities."""
        return sorted(self.sveitarfelog.values(), key=lambda x: x.name)
    
    def search(self, query: str) -> List[Sveitarfelag]:
        """Search municipalities by name or region."""
        query_lower = query.lower()
        return [s for s in self.sveitarfelog.values() 
                if query_lower in s.name.lower() or query_lower in s.region.lower()]
    
    def save(self) -> None:
        """Save municipalities to file."""
        data = {municipality_id: s.to_dict() for municipality_id, s in self.sveitarfelog.items()}
        with open(self.storage_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def load(self) -> None:
        """Load municipalities from file."""
        try:
            with open(self.storage_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                if not content:
                    self.sveitarfelog = {}
                else:
                    data = json.loads(content)
                    self.sveitarfelog = {municipality_id: Sveitarfelag.from_dict(s) for municipality_id, s in data.items()}
        except (FileNotFoundError, json.JSONDecodeError):
            self.sveitarfelog = {}

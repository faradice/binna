"""
Sveitarfélag (Municipality) data model and management system.
"""
import json
from typing import Optional, List, Dict
from dataclasses import dataclass, asdict


@dataclass
class Sveitarfelag:
    """Represents an Icelandic municipality (sveitarfélag)."""
    name: str
    population: int
    region: str
    id: Optional[str] = None
    
    def __post_init__(self):
        if self.id is None:
            # Generate a simple ID from name if not provided
            self.id = self.name.lower().replace(' ', '_').replace('ö', 'o').replace('á', 'a').replace('í', 'i').replace('ð', 'd').replace('þ', 'th').replace('æ', 'ae')
    
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
    
    def get(self, id: str) -> Optional[Sveitarfelag]:
        """Get a municipality by ID."""
        return self.sveitarfelog.get(id)
    
    def update(self, id: str, **kwargs) -> None:
        """Update a municipality."""
        if id not in self.sveitarfelog:
            raise ValueError(f"Municipality with id '{id}' not found")
        
        sveitarfelag = self.sveitarfelog[id]
        for key, value in kwargs.items():
            if hasattr(sveitarfelag, key) and key != 'id':
                setattr(sveitarfelag, key, value)
        self.save()
    
    def delete(self, id: str) -> None:
        """Delete a municipality."""
        if id not in self.sveitarfelog:
            raise ValueError(f"Municipality with id '{id}' not found")
        del self.sveitarfelog[id]
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
        data = {id: s.to_dict() for id, s in self.sveitarfelog.items()}
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
                    self.sveitarfelog = {id: Sveitarfelag.from_dict(s) for id, s in data.items()}
        except (FileNotFoundError, json.JSONDecodeError):
            self.sveitarfelog = {}

"""
Tests for the sveitarfélag management system.
"""
import os
import json
import tempfile
import unittest
from sveitarfelag import Sveitarfelag, SveitarfelagManager


class TestSveitarfelag(unittest.TestCase):
    """Test the Sveitarfélag data model."""
    
    def test_create_sveitarfelag(self):
        """Test creating a municipality."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        self.assertEqual(s.name, "Reykjavík")
        self.assertEqual(s.population, 131136)
        self.assertEqual(s.region, "Höfuðborgarsvæðið")
        self.assertIsNotNone(s.id)
    
    def test_auto_generate_id(self):
        """Test that ID is auto-generated from name."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        self.assertEqual(s.id, "reykjavik")
    
    def test_custom_id(self):
        """Test using a custom ID."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið", id="rvk")
        self.assertEqual(s.id, "rvk")
    
    def test_empty_name_raises_error(self):
        """Test that empty name raises error."""
        with self.assertRaises(ValueError) as ctx:
            Sveitarfelag(name="", population=1000, region="Region")
        self.assertIn("name cannot be empty", str(ctx.exception))
    
    def test_empty_region_raises_error(self):
        """Test that empty region raises error."""
        with self.assertRaises(ValueError) as ctx:
            Sveitarfelag(name="Name", population=1000, region="")
        self.assertIn("Region cannot be empty", str(ctx.exception))
    
    def test_negative_population_raises_error(self):
        """Test that negative population raises error."""
        with self.assertRaises(ValueError) as ctx:
            Sveitarfelag(name="Name", population=-100, region="Region")
        self.assertIn("must be a positive integer", str(ctx.exception))
    
    def test_zero_population_raises_error(self):
        """Test that zero population raises error."""
        with self.assertRaises(ValueError) as ctx:
            Sveitarfelag(name="Name", population=0, region="Region")
        self.assertIn("must be a positive integer", str(ctx.exception))
    
    def test_to_dict(self):
        """Test converting to dictionary."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        d = s.to_dict()
        self.assertEqual(d['name'], "Reykjavík")
        self.assertEqual(d['population'], 131136)
        self.assertEqual(d['region'], "Höfuðborgarsvæðið")
    
    def test_from_dict(self):
        """Test creating from dictionary."""
        d = {'name': 'Akureyri', 'population': 19219, 'region': 'Norðurland eystra', 'id': 'akureyri'}
        s = Sveitarfelag.from_dict(d)
        self.assertEqual(s.name, 'Akureyri')
        self.assertEqual(s.population, 19219)
        self.assertEqual(s.region, 'Norðurland eystra')


class TestSveitarfelagManager(unittest.TestCase):
    """Test the SveitarfélagManager."""
    
    def setUp(self):
        """Set up test with temporary file."""
        self.temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json')
        self.temp_file.close()
        self.manager = SveitarfelagManager(self.temp_file.name)
    
    def tearDown(self):
        """Clean up temporary file."""
        if os.path.exists(self.temp_file.name):
            os.unlink(self.temp_file.name)
    
    def test_add_sveitarfelag(self):
        """Test adding a municipality."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        self.assertIn(s.id, self.manager.sveitarfelog)
    
    def test_add_duplicate_raises_error(self):
        """Test that adding duplicate raises error."""
        s = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        with self.assertRaises(ValueError):
            self.manager.add(s)
    
    def test_get_sveitarfelag(self):
        """Test getting a municipality."""
        s = Sveitarfelag(name="Akureyri", population=19219, region="Norðurland eystra")
        self.manager.add(s)
        retrieved = self.manager.get(s.id)
        self.assertIsNotNone(retrieved)
        self.assertEqual(retrieved.name, "Akureyri")
    
    def test_get_nonexistent_returns_none(self):
        """Test getting nonexistent municipality returns None."""
        result = self.manager.get("nonexistent")
        self.assertIsNone(result)
    
    def test_update_sveitarfelag(self):
        """Test updating a municipality."""
        s = Sveitarfelag(name="Kópavogur", population=37159, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        self.manager.update(s.id, population=38000)
        updated = self.manager.get(s.id)
        self.assertEqual(updated.population, 38000)
    
    def test_update_with_invalid_attribute_raises_error(self):
        """Test updating with invalid attribute raises error."""
        s = Sveitarfelag(name="Kópavogur", population=37159, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        with self.assertRaises(ValueError) as ctx:
            self.manager.update(s.id, invalid_field="value")
        self.assertIn("Invalid attributes", str(ctx.exception))
    
    def test_update_cannot_change_id(self):
        """Test that ID cannot be updated."""
        s = Sveitarfelag(name="Kópavogur", population=37159, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        original_id = s.id
        with self.assertRaises(ValueError) as ctx:
            self.manager.update(s.id, id="new_id")
        self.assertIn("Invalid attributes", str(ctx.exception))
        # Verify ID hasn't changed
        updated = self.manager.get(original_id)
        self.assertIsNotNone(updated)
        self.assertEqual(updated.id, original_id)
    
    def test_update_with_empty_name_raises_error(self):
        """Test updating with empty name raises error."""
        s = Sveitarfelag(name="Kópavogur", population=37159, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        with self.assertRaises(ValueError) as ctx:
            self.manager.update(s.id, name="")
        self.assertIn("name cannot be empty", str(ctx.exception))
    
    def test_update_nonexistent_raises_error(self):
        """Test updating nonexistent municipality raises error."""
        with self.assertRaises(ValueError):
            self.manager.update("nonexistent", population=1000)
    
    def test_delete_sveitarfelag(self):
        """Test deleting a municipality."""
        s = Sveitarfelag(name="Hafnarfjörður", population=29799, region="Höfuðborgarsvæðið")
        self.manager.add(s)
        self.manager.delete(s.id)
        self.assertNotIn(s.id, self.manager.sveitarfelog)
    
    def test_delete_nonexistent_raises_error(self):
        """Test deleting nonexistent municipality raises error."""
        with self.assertRaises(ValueError):
            self.manager.delete("nonexistent")
    
    def test_list_all(self):
        """Test listing all municipalities."""
        s1 = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        s2 = Sveitarfelag(name="Akureyri", population=19219, region="Norðurland eystra")
        self.manager.add(s1)
        self.manager.add(s2)
        all_sveitarfelog = self.manager.list_all()
        self.assertEqual(len(all_sveitarfelog), 2)
        # Should be sorted by name
        self.assertEqual(all_sveitarfelog[0].name, "Akureyri")
        self.assertEqual(all_sveitarfelog[1].name, "Reykjavík")
    
    def test_search(self):
        """Test searching municipalities."""
        s1 = Sveitarfelag(name="Reykjavík", population=131136, region="Höfuðborgarsvæðið")
        s2 = Sveitarfelag(name="Akureyri", population=19219, region="Norðurland eystra")
        s3 = Sveitarfelag(name="Reykjanesbær", population=19676, region="Suðurnes")
        self.manager.add(s1)
        self.manager.add(s2)
        self.manager.add(s3)
        
        # Search by name
        results = self.manager.search("Reykja")
        self.assertEqual(len(results), 2)
        
        # Search by region
        results = self.manager.search("Norðurland")
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].name, "Akureyri")
    
    def test_save_and_load(self):
        """Test saving and loading from file."""
        s = Sveitarfelag(name="Ísafjörður", population=2633, region="Vestfirðir")
        self.manager.add(s)
        
        # Create new manager with same file
        manager2 = SveitarfelagManager(self.temp_file.name)
        loaded = manager2.get(s.id)
        self.assertIsNotNone(loaded)
        self.assertEqual(loaded.name, "Ísafjörður")
        self.assertEqual(loaded.population, 2633)
    
    def test_load_corrupted_json_file(self):
        """Test loading corrupted JSON file."""
        # Write corrupted JSON to file
        with open(self.temp_file.name, 'w') as f:
            f.write("{invalid json")
        
        # Manager should handle this gracefully
        manager = SveitarfelagManager(self.temp_file.name)
        self.assertEqual(len(manager.sveitarfelog), 0)


if __name__ == '__main__':
    unittest.main()

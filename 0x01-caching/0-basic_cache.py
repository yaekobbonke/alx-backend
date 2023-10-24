#!/usr/bin/python3

"""Basic dictionary"""
BaseCaching = __import__('base_caching').BaseCaching


class BasicCache(BaseCaching):
    """basic cache"""
    def __init__(self):
        super().__init__()

    def put(self, key, item):
        """updates dictionary"""
        self.cache_data[key] = item

        if key is None or item is None:
            return
    def get(self, key):
        """retrieve the elements of dictionary"""

        if key is None or key not in self.cache_data:
            return None
        return self.cache_data[key]


#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""

import csv
import math
from typing import Dict, List


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> Dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> Dict:
        assert index is None or (
            isinstance(
                index, int) and index >= 0), "Invalid index value"

        dataset = self.dataset()
        dataset_length = len(dataset)

        if index is not None:
            assert index < dataset_length, "Index out of range"
            start_index = index
        else:
            start_index = 0

        end_index = start_index + page_size
        data = []

        while start_index < dataset_length and len(data) < page_size:
            if start_index in self.indexed_dataset():
                data.append(dataset[start_index])
            start_index += 1

        next_index = start_index

        return {
            "index": index,
            "next_index": next_index,
            "page_size": page_size,
            "data": data
        }

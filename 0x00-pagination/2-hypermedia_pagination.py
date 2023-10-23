#!/usr/bin/env python3
"""returns dictionary"""
import csv
import math
from typing import List, Dict, Union


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """Returns a specific page of data from the dataset.
        """
        assert isinstance(page, int) and page > 0
        assert isinstance(page_size, int) and page_size > 0
        dataset = self.dataset()
        start_index, end_index = self.index_range(page, page_size)

        if start_index >= len(dataset):
            return []

        return dataset[start_index:end_index]

   def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[str, Union[int, List[List]], None]:
    """Returns a dictionary with hyper-paging information.
    """
    assert isinstance(page, int) and page > 0
    assert isinstance(page_size, int) and page_size > 0
    dataset = self.get_page(page, page_size)
    total_pages = math.ceil(len(self.dataset()) / page_size)
    next_page = page + 1 if page < total_pages else None
    prev_page = page - 1 if page > 1 else None

    hyper_data: Dict[str, Union[int, List[List]], None] = {
        'page_size': len(dataset),
        'page': page,
        'data': dataset,
        'next_page': next_page,
        'prev_page': prev_page,
        'total_pages': total_pages
    }

    return hyper_data


def index_range(self, page: int, page_size: int) -> tuple:
    """Calculates the start and end indices for a given page and page size.
        """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return start_index, end_index

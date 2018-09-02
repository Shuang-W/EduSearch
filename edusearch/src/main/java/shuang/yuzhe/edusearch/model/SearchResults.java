package shuang.yuzhe.edusearch.model;

import java.util.ArrayList;
import java.util.List;

public class SearchResults {
	public List<SearchResult> results = new ArrayList<>();
	public SearchResults() {}
	public void addResult(SearchResult result) {
		results.add(result);
	}
}

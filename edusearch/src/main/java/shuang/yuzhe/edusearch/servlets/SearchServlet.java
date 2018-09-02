package shuang.yuzhe.edusearch.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;

import shuang.yuzhe.edusearch.model.SearchResult;
import shuang.yuzhe.edusearch.model.SearchResults;


@WebServlet("/api/search/") 
public class SearchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
         throws ServletException, IOException {
	   resp.setContentType("application/json");
	   resp.setCharacterEncoding("UTF-8");
	   String string1 = req.getParameter("query");
	   String string2 = req.getParameter("type");
	   SearchResults results = new SearchResults();
	   SearchResult result = new SearchResult();
	   result.user = "sean";
	   result.file = "143215/file1";
	   result.id = "earegaighr";
	   result.date = "2018/09/12";
	   results.addResult(result);
	   
	   String json = new Gson().toJson(new SearchResults());
	   resp.getWriter().write(json);
	   }
	
	
}

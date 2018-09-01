package shuang.yuzhe.edusearch.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/fuck")
public class FuckYouServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) 
         throws ServletException, IOException {
	   resp.setContentType("text/html");
	   String string1 = req.getParameter("fucker_name");
	   String string2 = req.getParameter("being_fucked_name");
	   PrintWriter out = resp.getWriter();
	      String title = "Using GET Method to Read Form Data";
	      String docType =
	         "<!doctype html public \"-//w3c//dtd html 4.0 " + "transitional//en\">\n";
	         
	      out.println(docType +
	         "<html>\n" +
	            "<head><title>" + title + "</title></head>\n" +
	            "<body bgcolor = \"#f0f0f0\">\n" +
	               "<h1 align = \"center\">" + title + "</h1>\n" +
	               "<ul>\n" +
	                  "  <li><b>First Name</b>: "
	                  + string1 + "\n" +
	                  "  <li><b>Last Name</b>: "
	                  + string2 + "\n" +
	               "</ul>\n" +
	            "</body>" +
	         "</html>"
	      );
	   //resp.getWriter().write("Fuck you!" + string1 + ", " + string2 + " Maven Web Project Example.");
	   }
	
	
}

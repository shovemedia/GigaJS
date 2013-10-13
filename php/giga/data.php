<?php

class data
{
	function data ($f)
	{
		$root = $_SERVER['DOCUMENT_ROOT'];

		$f_dir = dirname($f);

		$this->dir = str_replace($root, '', $f_dir) . '/';

		$file = basename($f, '.php') . '.html';
		//$data = file_get_contents($file);
		// echo ('dir:  ' . $f_dir );


		$doc = new DOMDocument();
		$doc->loadHTMLFile($f_dir . '/' . $file); //
		//$doc->replaceChild($doc->firstChild->firstChild, $doc);

		$this->walkDom($doc);

		$content = preg_replace(array("/^\<\!DOCTYPE.*?<html><body>/si",
	                                  "!</body></html>$!si"),
	                            "",
	                            $doc->saveHTML());

		echo '<div data-rel="'. $this->dir .'">';
		echo $content;
		echo '</div>';
	}	

	//echo ('dir: ' . $dir);

	function normalizePath ($href)
	{
		return $this->dir . $href;
	}


	function walkDom($node, $level = 0)
	{
		// $indent = '';
		// for ($i = 0; $i < $level; $i++)
		// 	$indent .= '&nbsp;&nbsp;'; //prettifying the output

		if($node->nodeType != XML_TEXT_NODE)
		{
			//echo $indent.'<b>'.$node->nodeName.'</b>';
			if( $node->nodeType == XML_ELEMENT_NODE )
			{
				$attributes = $node->attributes; // get all the attributes(eg: id, class …)
				foreach($attributes as $attribute)
				{
					//echo ', '.$attribute->name.'='.$attribute->value;
					
					if($attribute->name == 'href')
					{
						$attribute->value = $this->normalizePath($attribute->value);
					}
					else if($attribute->name == 'src')
					{
						$attribute->value = $this->normalizePath($attribute->value);
					}



					// $attribute->name is usually one of these:
					// src, type, rel, link, name, value, href, onclick,
					// id, class, style, title
					// You can add your custom handlers depending on the Attribute.
				}
				//if( strlen(trim($node->childNodes->item(0)->nodeValue)) > 0 && count($cNodes) == 1 )
				//echo '<br>'.$indent.'(contains='.$node->childNodes->item(0)->nodeValue.')'; // do this to print the contents of a node, which maybe the link text, contents of div and so on.
			}
		}

		$cNodes = $node->childNodes;
		if (count($cNodes) > 0)
		{
			$level++ ; // go one level deeper
			foreach($cNodes as $cNode)
			{	
				$this->walkDom($cNode, $level); //so this is recursion my professor kept talkin' about
			}
			$level = $level - 1;
		}
	}


}

?>
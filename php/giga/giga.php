<?php

class giga
{
	function giga($gigaroot = '/')
	{
		$this->root = $_SERVER['DOCUMENT_ROOT']; //;
		$this->gigaroot = $gigaroot; 

		$this->dataClass = 'data.php';
		$this->datafile = 'data.html';

		require_once( $this->root . $this->gigaroot . '/giga/' . $this->dataClass);

		
		//$_SERVER['REQUEST_URI']
		$request = $_SERVER['REQUEST_URI'];
		// $endsWith = 'data';



		$path_parts = pathinfo($request);

		// echo '*** PATH INFO *** ' .$request . "\n";
		// echo 'giga: ' . $this->gigaroot, "\n";
		// echo 'dir ' . $path_parts['dirname'], "\n";
		// echo 'base ' . $path_parts['basename'], "\n";
		// echo 'ext ' . $path_parts['extension'], "\n";
		// echo 'filename ' . $path_parts['filename'], "\n"; // since PHP 5.2.0

				
			// if (isset($path_parts['extension']))
			// {	
			// 	$this->dir = str_replace($this->root, '', $path_parts['dirname']); //$f
			// }
			// else {
				$this->dir = $path_parts['dirname'];



				if ($this->dir == '/')
				{
					//echo $this->dir  . '  vs  ' . $this->gigaroot;

					// echo 'A*: '. $this->dir .'#' . "\n";
					$this->dir .= $path_parts['filename'];// . '/';
					// echo 'B*: ' . $this->dir . "\n";
				}
				else
				{
					// echo 'C*: '. $this->dir .'#' . "\n";
					$this->dir .= '/' . $path_parts['filename'];
					// echo 'D*: ' . $this->dir . "\n";
					
				}	
				$this->dir = str_replace( $this->gigaroot, '', $this->dir);
			//}		
			
			//dir = dirname($this->root . $request);


	 			//echo "XXX dir: " . $this->dir . "\n";


			//if it's a datafile request
			if(
				substr($request, -strlen($this->dataClass)) === $this->dataClass)
			{

				// echo('request: '. $request . "\n");
				// echo('pre: ' . $this->dir); 

				$this->dir = str_replace($this->dataClass, '', $this->dir); //$f



				$this->contentEmbed($_POST['depth']);

				// $file = dirname($this->root . $this->gigaroot . $this->dir) .'/'. $this->datafile;

				// //echo "XXX file: " . $file . "\n";

				// new data($file);

				exit;
			}
			//$needle === "" ||

		}

		function content ()
		{
			echo '<div class="gigaBase" data-root="' . $this->gigaroot . '">' . "\n";

			$this->contentEmbed();

			echo '</div>';
		}

		function contentEmbed ($requestedDepth = -1)
		{
			$depth = 0;
			$dir_array = explode('/', $this->dir);
			$len = count($dir_array) - 1;

			$path = '';

			//data-dir="' . $this->dir . '"

			foreach($dir_array as $folder)
			{
				$path .=  $folder . '/';

				// echo '*** folder: ';
				// echo $folder . "\n";
				// echo '<br/>';
				// echo $request . ' ### ' . $this->root . '/' . $this->gigaroot .  $path  . $this->datafile . "\n";

				$depth++;

				if ($requestedDepth != -1 && $depth > $len)
				{
					// echo "Break: " . $depth . ' ' . $len . "\n";
					break;
				}

				// echo "folder: " . $folder . "\n";
				// echo "PATH: " . $this->root . $this->gigaroot .  $path  . $this->datafile  . "\n";
				// echo "len: " . $len  . "\n";
				// echo "depth: " . $depth  . "\n";
				// echo "req depth: " . $requestedDepth  . "\n";

				if ($requestedDepth == -1 || $len - $depth <= $requestedDepth)
				{
					new data($this->root . $this->gigaroot .  $path  . $this->datafile);			
				}
				// else
				// {
				// 	echo "DROP: " . $this->root . $this->gigaroot .  $path  . $this->datafile  . "\n";
				// }	

				echo "\n";
			}

		}

	} 

?>
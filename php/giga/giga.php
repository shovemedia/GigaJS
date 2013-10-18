<?php

class giga
{
	function giga($gigaroot)
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
						//echo 'A: '. $this->dir .'#';
						$this->dir .= $path_parts['filename'] . '/';
					}
					else
					{

						$this->dir .= '/' . $path_parts['filename'];
						//echo 'B: '. $this->dir .'#';
					}	
					$this->dir = str_replace( $this->gigaroot, '', $this->dir);
				//}		
				
				//dir = dirname($this->root . $request);


		 			//echo "XXX dir: " . $this->dir . "\n";


			//if it's a datafile request
			if(
				substr($request, -strlen($this->dataClass)) === $this->dataClass)
			{
				$file = dirname($this->root . $this->gigaroot . $this->dir) .'/'. $this->datafile;//Class, '.php') . '.html';

				//echo "XXX file: " . $file . "\n";

				new data($file);

				exit;
			}
			//$needle === "" ||

		}


		function content ()
		{
			$dir_array = explode('/', $this->dir);

			$path = '';

			echo '<div class="gigaContent" data-rel="' . $this->gigaroot . '"></div>';

			foreach($dir_array as $folder)
			{
				$path .=  $folder . '/';

				// echo '*** folder: ';
				// echo $folder . "\n";
				// echo '<br/>';
				// echo $request . ' ### ' . $this->root . '/' . $this->gigaroot .  $path  . $this->datafile . "\n";

				new data($this->root . $this->gigaroot .  $path  . $this->datafile);
				
				if ($this->dir == '/')
				{
					break;
				}
			}
		}

	} 

?>
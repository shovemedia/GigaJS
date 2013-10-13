<?php

class giga
{
	function giga()
	{
		$this->datafile = 'data.php';
		$this->root = $_SERVER['DOCUMENT_ROOT'];
		require_once( $this->root . '/giga/' . $this->datafile);

		
		//$_SERVER['REQUEST_URI']
		$request = $_SERVER['REQUEST_URI'];
		// $endsWith = 'data';


				// echo '*** PATH INFO ***';
		$path_parts = pathinfo($request);

		// echo 'dir ' . $path_parts['dirname'], "\n";
		// echo 'base ' . $path_parts['basename'], "\n";
		// echo 'ext ' . $path_parts['extension'], "\n";
		// echo 'filename ' . $path_parts['filename'], "\n"; // since PHP 5.2.0

				
				if (isset($path_parts['extension']))
				{	
					$this->dir = str_replace($this->root, '', $path_parts['dirname']); //$f
				}
				else {
					$this->dir = $path_parts['dirname'];
					if ($this->dir == '/')
					{
						//echo 'A: '. dir .'#';
						$this->dir .= $path_parts['filename'];
					}
					else
					{
						//echo 'B: '. dir .'#';
						$this->dir .= '/' . $path_parts['filename'];
					}	
					$this->dir = str_replace($this->root, '', $this->dir);
				}		
				
				//dir = dirname($this->root . $request);





			//if it's a datafile request
			if(
				substr($request, -strlen($this->datafile)) === $this->datafile)
			{
				new data($this->root . $this->dir .'/'. $this->datafile);
				exit;
			}
			//$needle === "" ||

		}


		function content ()
		{
			$dir_array = explode('/', $this->dir);

			foreach($dir_array as $folder)
			{
				$this->root .= $folder . '/';

				// echo '*** folder: ';
				// echo $folder;
				// echo '<br/>';
				// echo $request . ' ### ' . root . datafile;

				new data($this->root . $this->datafile);
				
				if ($this->dir == '/')
				{
					break;
				}	
			}
		}

	} 

?>
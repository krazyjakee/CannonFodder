<?php

	if(isset($_POST['saveAttr'])){
		$name = $_POST['saveAttr'];
		$attrs = $_POST['value'];

		file_put_contents("resources/map/".$name."_attributes.json", $attrs);
	}
	else if(isset($_GET['loadMaps'])){
		$dir = dirname(__FILE__)."\\resources\\map";
		$iterator = new DirectoryIterator($dir);
		$files = [];
		foreach ($iterator as $fileinfo) {
		    if ($fileinfo->isFile()) {
		    	$fname = $fileinfo->getFilename();
		    	if (strpos($fname, "_attributes") == FALSE){
		        	array_push($files, $fname);
		    	}
		    }
		}
		echo json_encode($files);
	}

?>
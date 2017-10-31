<?php 

header("Access-Control-Allow-Origin: *");

class Flatcher{

	function __construct(){
		$this->method = $_POST['method'];
		$this->URL = $_POST['url'];
		$this->responseContent = '';
		$this->payload = [];
		if ( !empty($_POST['params']) ){
			$this->payload = json_decode( $_POST['params'], true );
		}
	}

	/**
	* @param $params Array
	*/
	function serializeParams( $params ){
		$result = '';
		foreach ($params as $key => $value) {
			$result .= $key.'='.$value.'&';
		}
		if ( strpos( $this->URL, '?' ) ) $result = '&'.$result;
		else $result = '?'.$result;
		return $result;
	}

	function sendFetchRequest(){

		if ( !empty($this->URL) ){

			$ch = curl_init();

			if ( $this->method=='GET' && !empty($this->payload) ){
				$serializedParams = $this->serializeParams( $this->payload );
				$this->URL = $this->URL.$serializedParams;
			}

			curl_setopt($ch, CURLOPT_URL, $this->URL);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

			if ( $this->method == 'POST' ){
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($this->payload) );
			}

			$this->responseContent = curl_exec( $ch );
			curl_close( $ch );
			$this->printContent();

		}

	}

	function printContent(){
		echo $this->responseContent;
	}

}

$flatcher = new Flatcher();
$flatcher->sendFetchRequest();

?>
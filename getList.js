// 변수선언
Array.prototype.remove = function (index) {this.splice(index, 1); } // 배열 초기화 시키기 위한 remove();
var currentIndex=0; // 메뉴 현재 인덱스 값
var lastIndex; // 메뉴 리스트의 마지막 인덱스 값
var output; // display_menu 출력부
var sub_output; // preview 출력부
var current_cId; // 현재 해당 categoryId
// 하스 url
var pathForCategoryList="http://softstb.cjhellovision.com:8080/HApplicationServer/getCategoryTree.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62&categoryProfile=4";
var param; // 필요한 데이터 뽑기 위한 파라미터
var menu=[]; //왼쪽 메뉴 리스트 저장
var cancel_id; // 이전메뉴로 돌아갈 때 필요한 parentCategoryId
var index=[]; // depth별 인덱스 저장
var categoryList; // json 데이터 저장할 변수
var x; // 왼쪽 메뉴에 나타나는 리스트(9개)의 인덱스
var y; // 오른쪽 textList의 인덱스
//assetList url
var pathForTextList="http://softstb.cjhellovision.com:8080/HApplicationServer/getAssetList.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62&assetProfile=8&pageSize=10";
var focusType=0; // 포커스 왼쪽에 위치&오른쪽 미리보기=0; 포커스 왼쪽&오른쪽 TextList=1; 포커스 오른쪽=2
var pageIdx=0; // textList 현재 페이지
var totalPage; // textList 총 페이지 수
var server = "http://softstb.cjhellovision.com:8080/images"; //포스터 이미지에 사용할 주소 앞부분
var imgName; // 이미지 파일 이름
var assetList; // json 데이터 저장할 변수

// json 가져오기
function loadJSON(path, param){
	return $.ajax({
	    url : path + param,
	    dataType : "json",
	    type : "post",
	    async: false, //동기: false, 비동기: true
	    error:function(request,status,error){
	        alert("code:"+request.status+"\n"+"error:"+error);
	    }
	}).responseText; 
}

//키보드 이벤트
function pressKeyboard(keyCode){
	// 하 키
	if (keyCode == 40) {
		if ( focusType == 0 || focusType == 1 ){ // 왼쪽 메뉴
			moveDownCategoryMenuFocus();
		} else if ( focusType == 2 ){ // TextList
			moveDownTextListFocus();
		}
	// 상 키
	} else if (keyCode == 38){ 
		if ( focusType == 0 || focusType == 1 ) { // 왼쪽 메뉴
			moveUpCategoryMenuFocus();
		} else if ( focusType == 2 ){ // TextList
			moveUpTextListFocus();
		}
	// 엔터키 or 우키
	} else if (keyCode == 13 || keyCode == 39){ 
		
		if ( focusType == 0 ){ // 왼쪽 메뉴
			index[depth].x=x;
			index[depth].output=output;
			getCategoryMenuList(current_cId);
			showCategoryMenu(depth, keyCode);
			showRightMenu(current_cId);
		
		} else if ( focusType == 1 ){ // TextList
			$("#bg_left").attr("class", "bg_left");
			$("#bg_right").attr("class", "bg_right focus");
			$("#submenu_list li:first").attr("class", "submenu_box focus");
			y=0;
			focusType=2;
		}
	// 백스페이스 or 좌키 : 이전으로 이동
	} else if (keyCode == 8 || keyCode == 37){ 
		
		if ( focusType == 0 || focusType == 1 ){ // 왼쪽 메뉴
			if (depth > 1){
				for (i=index[depth].lastIndex; i>index[depth].firstIndex-1; i--){
					menu.remove(i);
				}
				depth=depth-1;
				output=index[depth].output;
				x=index[depth].x;
				$(".display_menu_list").html(output); 
				$(".menu_list li").eq(x).attr("class", "menu_box focus");
				current_cId=menu[index[depth].currentIndex].categoryId;
				showRightMenu(current_cId);
			}
		
		} else if (focusType == 2){ // TextList
			focusType = 1;
			$("#bg_left").attr("class", "bg_left focus");
			$("#bg_right").attr("class", "bg_right");
			showRightMenu(current_cId);
		}
	}
}


//서브메뉴 리스트 생성 - 
function showRightMenu(id){
	// 컨텐츠 
	if (menu[index[depth].currentIndex].leaf===true){ 
		
		$("#bg_right_preview").hide();
		$("#bg_right").show();
		focusType=1;
		pageIdx=0;
		param="&categoryId="+id+"&pageIndex="+pageIdx;
		totalPage=JSON.parse(loadJSON(pathForTextList, param)).totalPage;
		getTextListOutput(param);
		
	// 미리보기
	} else { 
		focusType=0;
		param="&categoryId="+id+"&depth=2";
		categoryList=JSON.parse(loadJSON(pathForCategoryList, param)).categoryList;
		$("#bg_right").hide();
		$("#bg_right_preview").show();
		sub_output='<ul class="submenu_list">';
		for (i=1; i<categoryList.length; i++){
			sub_output+='<li>'+categoryList[i].categoryName+'</li>';
		}
		sub_output+='</ul>';
		$("#previewList").html(sub_output);
	}
}

// textList 다음 페이지 보여주기
function showNextTextList(id){
	param="&categoryId="+id+"&pageIndex="+pageIdx;
	getTextListOutput(param);
}

// 오른쪽 TextList 출력
function getTextListOutput(param){
	assetList=JSON.parse(loadJSON(pathForTextList, param)).assetList;
	sub_output=new EJS({url: 'textList.ejs'}).render(assetList);
	$("#bg_submenu").html(sub_output);
	$(".text").html(assetList[0].synopsis);
	var cnt=assetList[0].imageFileName.lastIndexOf("/");
	imgName=assetList[0].imageFileName.substring(cnt, assetList[0].imageFileName.length);
	$("img").attr("src", server+imgName);
}

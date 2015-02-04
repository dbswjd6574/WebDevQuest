// 변수선언
Array.prototype.remove = function (index) {this.splice(index, 1); } // 배열 초기화 시키기 위한 remove();
var currentIndex=0; // 메뉴 현재 인덱스 값
var lastIndex; // 메뉴 리스트의 마지막 인덱스 값
var output; // display_menu 출력부
var sub_output; // preview 출력부
var current_cId; // 현재 해당 categoryId
// 하스 url
var path="http://softstb.cjhellovision.com:8080/HApplicationServer/getCategoryTree.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62&categoryProfile=4";
var param; // 필요한 데이터 뽑기 위한 파라미터
var menu=[]; //왼쪽 메뉴 리스트 저장
var cancel_id; // 이전메뉴로 돌아갈 때 필요한 parentCategoryId
var index=[]; // depth별 인덱스 저장
var jsonObj; // json 데이터 저장할 변수
var x; // 왼쪽 메뉴에 나타나는 리스트(9개)의 인덱스
var y; // 오른쪽 textList의 인덱스
//assetList url
var pathForTextList="http://softstb.cjhellovision.com:8080/HApplicationServer/getAssetList.json?version=1&terminalKey=25C5C02283A06C80B1F18FCAB3C36D62&assetProfile=8&pageSize=10";
var focusIdx=0; // 포커스 왼쪽에 위치&오른쪽 미리보기=0; 포커스 왼쪽&오른쪽 TextList=1; 포커스 오른쪽=2
var pageIdx=0; // textList 현재 페이지
var totalPage; // textList 총 페이지 수

function loadJSON(param){
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

function loadJSONForTextList(param){
	return $.ajax({
	    url : pathForTextList + param,
	    dataType : "json",
	    type : "post",
	    async: false, //동기: false, 비동기: true
	    error:function(request,status,error){
	        alert("code:"+request.status+"\n"+"error:"+error);
	    }
	}).responseText; 
}

// 객체 가져오기
function getLeftMenuList(id){
	 param="&categoryId="+id+"&depth=2";
	 jsonObj=JSON.parse(loadJSON(param)).categoryList;
	 depth++;
	 for (var i=1; i<jsonObj.length; i++){
		 menu.push(jsonObj[i]);
		}
	 if (depth == 1){
		 index[depth]={firstIndex:0, lastIndex:menu.length-1, currentIndex:0, x:0, output:''};
	 } else if (depth > 1){
		 index[depth]={firstIndex:(index[depth-1].lastIndex)+1, lastIndex:menu.length-1, currentIndex:(index[depth-1].lastIndex)+1, x:0, output:''};
	 }
}

//왼쪽 메뉴 출력	
function showLeftMenu(depth, keyCode){
	
	var startIdx = index[depth].firstIndex;
	var endIdx = index[depth].lastIndex;
	var currentIdx = index[depth].currentIndex;
	
	if ( ( endIdx - startIdx ) <= 8 ) {
		current_cId=menu[currentIdx].categoryId;
		output = '<ul class="menu_list">'; 
		for (var i = startIdx; i < endIdx + 1 ; i++){ 
			currentIdx=startIdx;
			current_cId=menu[currentIdx].categoryId;
			x=0;
			output += '<li class="menu_box">'; 
			output += '<span class="menu" style="max-width: 280px;">'; 
			output += menu[i].categoryName+'</span>'; 
			output += '</li>'; 
		} 
		output+='</ul>'; 
		$(".display_menu_list").html(output); 
		$(".menu_list li").eq(0).attr("class", "menu_box focus");
		
	} else if ( ( endIdx - startIdx ) > 8 ) {
		if ( keyCode == null || keyCode == 13 || keyCode == 39){
			currentIdx=startIdx;
			current_cId=menu[currentIdx].categoryId;
			x=0;
			output = '<ul class="menu_list">'; 
			for (var i = startIdx; i < startIdx + 9 ; i++){ 
				output += '<li class="menu_box">'; 
				output += '<span class="menu" style="max-width: 280px;">'; 
				output += menu[i].categoryName+'</span>'; 
				output += '</li>'; 
			}
			output+='</ul>'; 
			$(".display_menu_list").html(output); 
			$(".menu_list li").eq(0).attr("class", "menu_box focus");
			
		} else if ( keyCode == 40 ) {
			if (currentIdx == startIdx) {
				output = '<ul class="menu_list">'; 
				for (var i = startIdx; i < startIdx + 9; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
				
			} else {
				output = '<ul class="menu_list">'; 
				for (var i = currentIdx - 8; i < currentIdx + 1; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			}
			
		} else if ( keyCode == 38){
			if (currentIdx == endIdx) {
				output = '<ul class="menu_list">'; 
				for (var i = endIdx - 8; i < endIdx + 1; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
				
			} else {
				output = '<ul class="menu_list">'; 
				for (var i = currentIdx ; i < currentIdx + 9; i++){ 
					output += '<li class="menu_box">'; 
					output += '<span class="menu" style="max-width: 280px;">'; 
					output += menu[i].categoryName+'</span>'; 
					output += '</li>'; 
				} 
				output+='</ul>'; 
				$(".display_menu_list").html(output); 
			}
		}
	}
}

//서브메뉴 리스트 생성 - textList로 넘어가는-> Leaf
function showRightMenu(id){
	
	// 컨텐츠 
	if (menu[index[depth].currentIndex].leaf===true){ 
		
		$(".text").html('!');
		for (i=jsonObj.length-1; i>-1; i--){
			jsonObj.remove(i);
		}
		
		focusIdx=1;
		pageIdx=0;
		param="&categoryId="+id+"&pageIndex="+pageIdx;
		totalPage=JSON.parse(loadJSONForTextList(param)).totalPage;
		jsonObj=JSON.parse(loadJSONForTextList(param)).assetList;
	
		$("#bg_right_preview").hide();
		$("#bg_right").show();
		
		sub_output='<ul class="submenu_list" id="submenu_list">';
		for (i=0; i<jsonObj.length; i++){
			sub_output+='<li class="submenu_box">';
			sub_output+='<span class="submenu_text">';
			sub_output+='<span class="rank_title02">';
			sub_output+=jsonObj[i].title+'</span><span class="won"></span>';
			sub_output+='</span></li>';
		}
		sub_output+='</ul>';
		
		$("#bg_submenu").html(sub_output);
		$(".text").html(jsonObj[0].synopsis);
//		$("img").attr("src", jsonObj[0].imageFileName);
		
	// 미리보기
	} else { 
		
		focusIdx=0;
		param="&categoryId="+id+"&depth=2";
		jsonObj=JSON.parse(loadJSON(param)).categoryList;
		$("#bg_right").hide();
		$("#bg_right_preview").show();
		
		sub_output='<ul class="submenu_list">';
		for (i=1; i<jsonObj.length; i++){
			sub_output+='<li>'+jsonObj[i].categoryName+'</li>';
		}
		sub_output+='</ul>';
		
		$("#previewList").html(sub_output);
		
	}
}

// textList 다음 페이지 보여주기
function showNextTextList(id, keyCode){
	
	// 하 키
	if (keyCode == 40){
		// 맨 마지막 페이지면
		if (pageIdx == totalPage-1){ 
			pageIdx=0; // 처음으로
		} else {
			++pageIdx;
		}
	// 상 키
	} else if (keyCode == 38 ){ 
		//맨 첫페이지면
		if (pageIdx == 0){
			pageIdx=totalPage-1; // 맨 마지막으로
		} else {
			--pageIdx;
		}
	}
	
	param="&categoryId="+id+"&pageIndex="+pageIdx;
	jsonObj=JSON.parse(loadJSONForTextList(param)).assetList;

	sub_output='<ul class="submenu_list" id="submenu_list">';
	for (i=0; i<jsonObj.length; i++){
		sub_output+='<li class="submenu_box">';
		sub_output+='<span class="submenu_text">';
		sub_output+='<span class="rank_title02">';
		sub_output+=jsonObj[i].title+'</span><span class="won"></span>';
		sub_output+='</span></li>';
	}
	sub_output+='</ul>';
	$("#bg_submenu").html(sub_output);
	
//	$("img").attr("src", jsonObj[0].imageFileName);
}


// 키보드 이벤트
function pressKeyboard(keyCode){
	// 하 키
	if (keyCode == 40) {
		// 왼쪽 메뉴
		if ( focusIdx == 0 || focusIdx == 1 ){
			// 리스트 길이가 9 이하일 때
			if ( (index[depth].lastIndex-index[depth].firstIndex) + 1 <= 9){
				// 포커스 한 칸씩 아래로 이동
				if (0 <= x && x < (index[depth].lastIndex-index[depth].firstIndex)) {
					++index[depth].currentIndex;
					$(".menu_list li").eq(x).attr("class", "menu_box");
					$(".menu_list li").eq(x+1).attr("class", "menu_box focus");
					++x;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				// 마지막 항목에 포커스 위치할 때 -> 맨 위로 점프!
				} else if (index[depth].currentIndex >= index[depth].lastIndex){
					index[depth].currentIndex = index[depth].firstIndex;
					$(".menu_list li").eq(x).attr("class", "menu_box");
					$(".menu_list li").eq(0).attr("class", "menu_box focus");
					x=0;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				}
				
			// 리스트 길이가 9 이상일 때
			} else {
				// 최하위 항목일 때
				if (index[depth].currentIndex >= index[depth].lastIndex){
					index[depth].currentIndex = index[depth].firstIndex;
					showLeftMenu(depth, keyCode);
					$(".menu_list li").eq(0).attr("class", "menu_box focus");
					x=0;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				
				// 포커스 한 칸 아래로 이동
				} else if (0 <= x && x < 8) {
					++index[depth].currentIndex;
					$(".menu_list li").eq(x).attr("class", "menu_box");
					$(".menu_list li").eq(x+1).attr("class", "menu_box focus");
					++x;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
					
				// 포커스가 제일 아래에 있어 한 칸씩 밀어야 할 때
				} else if ( x == 8 ){
					++index[depth].currentIndex;
					showLeftMenu(depth, keyCode);
					$(".menu_list li").eq(8).attr("class", "menu_box focus");
					x=8;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				}
				
			}
			
			
		// TextList
		} else if ( focusIdx == 2 ){
			// 포커스 한 칸씩 아래로 이동
			if (0 <= y && y < jsonObj.length-1){
				$("#submenu_list li").eq(y).attr("class", "submenu_box");
				$("#submenu_list li").eq(y+1).attr("class", "submenu_box focus");
				y=y+1;
				$(".text").html(jsonObj[y].synopsis);
//				$("img").attr("src", jsonObj[y].imageFileName);
			// 포커스가 맨 마지막 항목에 있을 때
			} else if ( y == jsonObj.length-1){
				// 페이지 = 1일 때 (데이터 로드 필요없음)
				if (totalPage == 1){
					$("#submenu_list li").eq(y).attr("class", "submenu_box");
					$("#submenu_list li").eq(0).attr("class", "submenu_box focus");
					y=0;
					$(".text").html(jsonObj[y].synopsis);
				// 페이지가 하나 이상 (다음 페이지 불러오기)
				} else {
					showNextTextList(current_cId, keyCode);
					y=0;
					$("#submenu_list li").eq(y).attr("class", "submenu_box focus");
					$(".text").html(jsonObj[y].synopsis);
				}
			} 
		}
	// 상 키
	} else if (keyCode == 38){ 
		
		// 왼쪽 메뉴
		if ( focusIdx == 0 || focusIdx == 1 ) {
			
			// 리스트 길이가 9 이하일 때
			if ( (index[depth].lastIndex-index[depth].firstIndex) + 1 <= 9){
				
				// 포커스 한 칸 위로 이동
				if (0 < x && x <= (index[depth].lastIndex-index[depth].firstIndex)) {
					--index[depth].currentIndex;
					$(".menu_list li").eq(x).attr("class", "menu_box");
					$(".menu_list li").eq(x-1).attr("class", "menu_box focus");
					--x;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
					
				// 맨 위 항목에 포커스 있을 때 -> 맨 아래로 점프!
				} else if (index[depth].currentIndex <= index[depth].firstIndex){
					index[depth].currentIndex = index[depth].lastIndex;
					x=index[depth].lastIndex-index[depth].firstIndex;
					$(".menu_list li").eq(0).attr("class", "menu_box");
					$(".menu_list li").eq(x).attr("class", "menu_box focus");
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				}
				
			//	리스트 길이가 9 이상일 때
			} else {
				
				// 최상위 항목일 때
				if (index[depth].currentIndex <= index[depth].firstIndex){ 
					index[depth].currentIndex = index[depth].lastIndex;
					showLeftMenu(depth, keyCode);
					$(".menu_list li").eq(8).attr("class", "menu_box focus");
					x=8;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
					
				// 포커스 한 칸 위로 이동
				} else if (0 < x && x <= 8) {
					--index[depth].currentIndex;
					$(".menu_list li").eq(x).attr("class", "menu_box");
					$(".menu_list li").eq(x-1).attr("class", "menu_box focus");
					--x;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
					
				// 포커스가 제일 위에 있어 한 칸 위로 밀어야 할 때
				} else if ( x == 0 ){
					--index[depth].currentIndex;
					showLeftMenu(depth, keyCode);
					$(".menu_list li").eq(0).attr("class", "menu_box focus");
					x=0;
					current_cId = menu[index[depth].currentIndex].categoryId; 
					showRightMenu(current_cId);
				}
			}
			
		// TextList
		} else if ( focusIdx == 2 ){
			
			// 포커스 한 칸씩 위로 이동
			if (jsonObj.length-1 >= y && y > 0){
				$("#submenu_list li").eq(y).attr("class", "submenu_box");
				$("#submenu_list li").eq(y-1).attr("class", "submenu_box focus");
				y=y-1;
				$(".text").html(jsonObj[y].synopsis);
//				$("img").attr("src", jsonObj[y].imageFileName);
				
			// 맨 첫 항목에 포커스 위치할 때
			} else if ( y == 0){
				
				// 페이지 = 1일 때 (데이터 로드 필요없음)
				if (totalPage == 1){
					$("#submenu_list li").eq(y).attr("class", "submenu_box");
					$("#submenu_list li").eq(jsonObj.length-1).attr("class", "submenu_box focus");
					y=jsonObj.length-1;
					$(".text").html(jsonObj[y].synopsis);
					
				// 페이지가 하나 이상 (이전 페이지 불러오기)
				} else if (totalPage > 1){
					showNextTextList(current_cId, keyCode);
					$("#submenu_list li").eq(jsonObj.length-1).attr("class", "submenu_box focus");
					y=jsonObj.length-1;
					$(".text").html(jsonObj[y].synopsis);
				}
			}
		}
		
	// 엔터키 or 우키
	} else if (keyCode == 13 || keyCode == 39){ 
		
		// 왼쪽 메뉴
		if ( focusIdx == 0 ){
			index[depth].x=x;
			index[depth].output=output;
			getLeftMenuList(current_cId);
			showLeftMenu(depth, keyCode);
			showRightMenu(current_cId);
			
		// TextList
		} else if ( focusIdx == 1 ){
			$("#bg_left").attr("class", "bg_left");
			$("#bg_right").attr("class", "bg_right focus");
			$("#submenu_list li:first").attr("class", "submenu_box focus");
			y=0;
			
			focusIdx=2;
		}
		
	// 백스페이스 or 좌키 : 이전으로 이동
	} else if (keyCode == 8 || keyCode == 37){ 
		
		// 왼쪽 메뉴
		if ( focusIdx == 0 || focusIdx == 1 ){
			if (depth > 1){
				for (i=index[depth].lastIndex; i>index[depth].firstIndex-1; i--){
					menu.remove(i);
				}
				--depth;
				output=index[depth].output;
				x=index[depth].x;
				$(".display_menu_list").html(output); 
				$(".menu_list li").eq(x).attr("class", "menu_box focus");
				current_cId=menu[index[depth].currentIndex].categoryId;
				showRightMenu(current_cId);
			}
			
		// TextList
		} else if (focusIdx == 2){
			focusIdx = 1;
			$("#bg_left").attr("class", "bg_left focus");
			$("#bg_right").attr("class", "bg_right");
			showRightMenu(current_cId);
		}
		
	}
}

/**
 * 
 */

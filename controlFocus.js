/* 포커스 제어 */

function moveDownCategoryMenuFocus(){
	// 리스트 길이가 9 이하일 때
	if ( (index[depth].lastIndex-index[depth].firstIndex) + 1 <= 9){
		// 포커스 한 칸씩 아래로 이동
		$(".menu_list li").eq(x).attr("class", "menu_box");
		if (0 <= x && x < (index[depth].lastIndex-index[depth].firstIndex)) {
			index[depth].currentIndex=index[depth].currentIndex+1;
			x=x+1;
		// 마지막 항목에 포커스 위치할 때 -> 맨 위로 점프!
		} else if (index[depth].currentIndex >= index[depth].lastIndex){
			index[depth].currentIndex = index[depth].firstIndex;
			x=0;
		}
	// 리스트 길이가 9 이상일 때
	} else {
		// 최하위 항목일 때
		if (index[depth].currentIndex >= index[depth].lastIndex){
			index[depth].currentIndex = index[depth].firstIndex;
			getCategoryListOutput(index[depth].firstIndex, index[depth].firstIndex + 9);
			x=0;
		// 포커스 한 칸 아래로 이동
		} else if (0 <= x && x < 8) {
			index[depth].currentIndex=index[depth].currentIndex+1;
			$(".menu_list li").eq(x).attr("class", "menu_box");
			x=x+1;
		// 포커스가 제일 아래에 있어 한 칸씩 밀어야 할 때
		} else if ( x == 8 ){
			++index[depth].currentIndex;
			getCategoryListOutput(index[depth].currentIndex - 8, index[depth].currentIndex + 1);
			x=8;
		}
	}
	$(".menu_list li").eq(x).attr("class", "menu_box focus");
	current_cId = menu[index[depth].currentIndex].categoryId; 
	showRightMenu(current_cId);
}

function moveUpCategoryMenuFocus(){
	// 리스트 길이가 9 이하일 때
	if ( (index[depth].lastIndex-index[depth].firstIndex) + 1 <= 9){
		// 포커스 한 칸 위로 이동
		$(".menu_list li").eq(x).attr("class", "menu_box");
		if (0 < x && x <= (index[depth].lastIndex-index[depth].firstIndex)) {
			index[depth].currentIndex=index[depth].currentIndex-1;
			x=x-1;
		// 맨 위 항목에 포커스 있을 때 -> 맨 아래로 점프!
		} else if (index[depth].currentIndex <= index[depth].firstIndex){
			index[depth].currentIndex = index[depth].lastIndex;
			x=index[depth].lastIndex-index[depth].firstIndex;
		}
	//	리스트 길이가 9 이상일 때
	} else {
		// 최상위 항목일 때
		if (index[depth].currentIndex <= index[depth].firstIndex){ 
			index[depth].currentIndex = index[depth].lastIndex;
			getCategoryListOutput(index[depth].lastIndex-8, index[depth].lastIndex+1);
			x=8;
		// 포커스 한 칸 위로 이동
		} else if (0 < x && x <= 8) {
			index[depth].currentIndex=index[depth].currentIndex-1;
			$(".menu_list li").eq(x).attr("class", "menu_box");
			x=x-1;
		// 포커스가 제일 위에 있어 한 칸 위로 밀어야 할 때
		} else if ( x == 0 ){
			index[depth].currentIndex=index[depth].currentIndex-1;
			getCategoryListOutput(index[depth].currentIndex, index[depth].currentIndex+9);
			x=0;
		}
	}
	$(".menu_list li").eq(x).attr("class", "menu_box focus");
	current_cId = menu[index[depth].currentIndex].categoryId; 
	showRightMenu(current_cId);
}

function moveDownTextListFocus(){
	// 포커스 한 칸씩 아래로 이동
	if (0 <= y && y < assetList.length-1){
		$("#submenu_list li").eq(y).attr("class", "submenu_box");
		y=y+1;
	// 포커스가 맨 마지막 항목에 있을 때
	} else if ( y == assetList.length-1){
		// 페이지 = 1일 때 (데이터 로드 필요없음)
		if (totalPage == 1){
			$("#submenu_list li").eq(y).attr("class", "submenu_box");
		// 페이지가 하나 이상 (다음 페이지 불러오기)
		} else {
			// 맨 마지막 페이지면
			if (pageIdx == totalPage-1){ 
				pageIdx=0; // 처음으로
			} else {
				pageIdx=pageIdx+1;
			}
			showNextTextList(current_cId);
		}
		y=0;
	} 
	$("#submenu_list li").eq(y).attr("class", "submenu_box focus");
	$(".text").html(assetList[y].synopsis);
	var cnt=assetList[y].imageFileName.lastIndexOf("/");
	imgName=assetList[y].imageFileName.substring(cnt, assetList[y].imageFileName.length);
	$("img").attr("src", server+imgName);
}

function moveUpTextListFocus(){
	// 포커스 한 칸씩 위로 이동
	if (assetList.length-1 >= y && y > 0){
		$("#submenu_list li").eq(y).attr("class", "submenu_box");
		y=y-1;
	// 맨 첫 항목에 포커스 위치할 때
	} else if ( y == 0){
		// 페이지 = 1일 때 (데이터 로드 필요없음)
		if (totalPage == 1){
			$("#submenu_list li").eq(y).attr("class", "submenu_box");
		// 페이지가 하나 이상 (이전 페이지 불러오기)
		} else if (totalPage > 1){
			//맨 첫페이지면
			if (pageIdx == 0){
				pageIdx=totalPage-1; // 맨 마지막으로
			} else{
				--pageIdx;
			}
			showNextTextList(current_cId);
		}
		y=assetList.length-1;
	}
	$("#submenu_list li").eq(y).attr("class", "submenu_box focus");
	$(".text").html(assetList[y].synopsis);
	var cnt=assetList[y].imageFileName.lastIndexOf("/");
	imgName=assetList[y].imageFileName.substring(cnt, assetList[y].imageFileName.length);
	$("img").attr("src", server+imgName);
}

var myApp = "https://script.google.com/macros/s/AKfycbxReyUtjtKLv1l3ycsex_ozJ--AphDLQbGmxw_8T_37m6AJX-16EXo00tR-bOlSiosLqA/exec";//URL нашего приложения
var tasks = "1fbfPhUc3brlOMU_aaVwUsXnRItLlJO4emw6id4olG-Y";//уникальный идентификатор нашей таблицы

$( document ).ready(function() {//функция запускается, как только страница будет готова для просмотра пользователю
	loadTasks ();//запускаем функцию для получения списка задач
	
	$('#taskListForm').on('change', function(e){
	    loadTasks ();
	});

	$('#commonModal').on('hidden.bs.modal', function (e) {
		$('.modal-title, .modal-body, .modal-footer, .alert-area').html('');
	})

});

function loadTasks () {
	var where = ($('#onlyInLine').prop('checked')) ? `WHERE C = 0` : ``;
	googleQuery (tasks, '0', 'A:H', `SELECT * ${where} ORDER BY A LIMIT 100`);
	//Эту функцию создал я для удобства. Она принимает следующие параметры по порядку:
	//1. Уникальный идентификатор таблицы;
	//2. Числовой идентификатор листа. По умолчанию у первого листа таблицы после ее создания он равен нулю. 
	//   При создании других листов генерируется 8-ми значный числовой идентификатор. 
	//   Увидеть его можно в адресной строке в параметре "gid" (например, "gid=99808602").
	//3. Столбцы, в которых будет осуществляться поиск согласно запросу.
	//4. Текст запроса в SQL-подобном формате. Обратите внимание, что формат все-таки отличается от SQL.
}

function googleQuery (sheet_id, sheet, range, query) {
	google.charts.load('45', {'packages':['corechart']});//загружаем библиотеку Google Charts
	google.charts.setOnLoadCallback (queryTable);//обозначаем, какая функция будет запущена по готовности библиотеки

	function queryTable () {
		//объект с настройками
		var opts = {sendMethod: 'auto'};
		//сама функция, выполняющая запрос к таблице
		var gquery = new google.visualization.Query(`https://docs.google.com/spreadsheets/d/${sheet_id}/gviz/tq?gid=${sheet}&range=${range}&headers=1&tq=${query}`, opts);
		//обозначаем, какая функция будет запущена при получении результатов
		console.log(gquery);
		gquery.send (callback);
	}

	function callback (e) {
		if (e.isError () ) {
			console.log(`Error in query: ${e.getMessage ()} ${e.getDetailedMessage ()}`);
			return;
		}//если ошибка, то записываем ее в консоль

		var data = e.getDataTable ();//если ошибки нет, то формируем данные для дальнейшей работы
		tasksTable (data); //передаем их в функцию, которая обработает данные и сформирует из них нашу таблицу
	}
}

function getTasks () {
	var action = "getTasks";
	var url = myApp+"?action="+action

	//подготавливаем и выполняем GET запрос
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
        	//в случае успеха преобразуем полученный ответ в JSON и передаем отдельной функции, которая сформирует нам таблицу
        	var data = JSON.parse(xhr.response);
			console.log(data);
        	tasksTable (data);
        }
    };
    try { xhr.send(); } catch (err) {console.log(err) }
}

setTimeout("window.location.reload(data)",10000)


//функция, которая обработает данные, полученные при выполнении запроса и сформирует из них таблицу
function tasksTable (data) {
	$('#tasksTableDiv').html(function(){

	var topic_name = [];
	var topic_id = [];
	for (i = 0; i < data.Tf.length; i++ ){
		if (topic_name.includes(data.Tf[i].c[1].v)==false){
			topic_name.push(data.Tf[i].c[1].v)
			topic_id.push(data.Tf[i].c[0].v)
		}
		console.log(topic_name);
		console.log(topic_id);
	}
	test = "test"
	x=''
		for ( i = 0; i < topic_name.length; i++  ) {
			body_lesson = ''
			for ( j = 0; j < data.Tf.length; j++ ) {
				console.log(data.Tf[j].c[7]);
				if (data.Tf[j].c[1].v==topic_name[i]){
					body_lesson+=


					`<div class="col-xl-4">
				<div class="card text-center">
				  <div class="card-body">
					<h5 class="card-title">${data.Tf[j].c[4].v}</h5>
					<p class="card-text">${data.Tf[j].c[6].v}</p>
					<!-- Кнопка-триггер модального окна -->
	<button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" style="width: 100% !important;">
	${data.Tf[j].c[4].v}
	</button>
	
	<!-- Модальное окно -->
	<div class="container-fluid" style="margin-top: 10px;">
	  <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
		<div class="modal-dialog modal-fullscreen modal-dialog-centered modal-dialog-scrollable">
		  <div class="modal-content">
			<div class="modal-header">
			  <h1 class="modal-title fs-5" id="staticBackdropLabel">${data.Tf[j].c[4].v}</h1>
			  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
			</div>
			<div class="modal-body">
			  <div align="left">
				<pre style="margin-bottom: 0; width: auto;">
				${data.Tf[j].c[7].v}					
				  </pre>
				</div>
			</div>
			<div class="modal-footer">
			  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
			</div>
		  </div>
		</div>
	  </div></div>
				  </div>				  
				</div>
			  </div>`





				}
			}



						x+= `
		
		<button class="btn btn-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#${topic_id[i]}" aria-expanded="false" aria-controls="collapseExample" style="width: 100%;">
        ${topic_name[i]}
      </button>
    </p>
    <div class="collapse" id="${topic_id[i]}">
      <div class="card card-body">
        <div class="row">${body_lesson}</div>
      </div>      
    </div>`
			
		
	
}

	return x;
	})
}

//${data.Tf[i].c[1].v}








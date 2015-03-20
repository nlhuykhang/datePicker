/**
 *  @name date-picker
 *  @description date picker
 *  @version 1.0
 *  @options
 *    format
 *    todayButton
 *    clearButton
 *  @events
 *    keydown
 *    click
 *    window click
 *    input
 *  @methods
 *    init
 *    getDate
 *    destroy
 */
;(function($, window, undefined) {
  var pluginName = 'date-picker',
    listMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    format, todayButton, clearButton;

  var getMonthByIndex = function(index) {
    var month = '';

    if (index >= 0 && index <= 11) {
      month = listMonth[index];
    } else {
      month = listMonth[0];
    }
    return month;
  };

  var getIndexByMonth = function(month) {
    var index = listMonth.indexOf(month);

    if (index === -1) {
      index = 0;
    }
    return index;
  };

  var isDate = function(day) {
    if (Object.prototype.toString.call(day) === "[object Date]") {
      if (isNaN(day.getTime())) {
        return false;
      } else {
        return true;
      }
    }
    return false;
  };

  var createTableDayTag = function(day, inputDay) {
    var tableString = '',
      firstDayOfCurMonth = new Date(day.getFullYear(), day.getMonth(), 1).getDay(),
      numDayofCurMonth = new Date(day.getFullYear(), day.getMonth() + 1, 0).getDate(),
      numDayOfPrevMonth = new Date(day.getFullYear(), day.getMonth(), 0).getDate(),
      flagDay = firstDayOfCurMonth ? firstDayOfCurMonth : 7,
      flagDate = 1,
      i, row = 0;

    tableString += '<tr>';
    for (i = 0; i < flagDay; i++) {
      tableString += '<td class="day old">' + (numDayOfPrevMonth - flagDay + i + 1) + '</td>';
    }
    if (flagDay === 7) {
      tableString += '</tr>';
      row++;
      flagDay = 0;
    }
    while (flagDate <= numDayofCurMonth) {
      if (flagDay === 0) {
        tableString += '<tr>';
      }
      if (isDate(inputDay) && day.getFullYear() === inputDay.getFullYear() &&
        day.getMonth() === inputDay.getMonth() && inputDay.getDate() === flagDate) {
        tableString += '<td class="day active">' + flagDate + '</td>';
      } else {
        tableString += '<td class="day">' + flagDate + '</td>';
      }

      flagDate++;
      flagDay++;
      if (flagDay > 6) {
        tableString += '</tr>';
        row++;
        flagDay = 0;
      }
    }
    if (flagDay === 0) {
      tableString += '<tr>';
    }
    i = 1;
    while (flagDay <= 6) {
      tableString += '<td class="day new">' + i + '</td>';
      i++;
      flagDay++;
    }
    tableString += '</tr>';
    row++;
    if (row < 6) {
      tableString += '<tr>';
      flagDay = 0;
      while (flagDay <= 6) {
        tableString += '<td class="day new">' + i + '</td>';
        i++;
        flagDay++;
      }
      tableString + '</tr>';
    }
    return tableString;
  };

  var createTFoot = function() {
    var textFoot = '';
    if (todayButton) {
      textFoot += '<tfoot><tr><th colspan="7" class="today" style="display: block;">Today</th></tr>';
    } else {
      textFoot += '<tfoot><tr><th colspan="7" class="today" style="display: none;">Today</th></tr>';
    }
    if (clearButton) {
      textFoot += '<tr><th colspan="7" class="clear" style="display: block;">Clear</th></tr></tfoot>';
    } else {
      textFoot += '<tr><th colspan="7" class="clear" style="display: none;">Clear</th></tr></tfoot>';
    }
    return textFoot;
  };

  var createDayTag = function(day, inputDay) {

    var calendar = '<div class="datepicker-days" style="display: block;"><table class=" table-condensed"><thead><tr><th class="prev" style="visibility: visible;">«</th><th colspan="5" class="datepicker-switch">' +
      getMonthByIndex(day.getMonth()) +
      ' ' +
      day.getFullYear() +
      '</th><th class="next" style="visibility: visible;">»</th></tr><tr><th class="dow">Su</th><th class="dow">Mo</th><th class="dow">Tu</th><th class="dow">We</th><th class="dow">Th</th><th class="dow">Fr</th><th class="dow">Sa</th></tr></thead><tbody>' +
      createTableDayTag(day, inputDay) +
      '</tbody>' +
      createTFoot() +
      '</table></div>';

    return calendar;
  };

  var createMonthTag = function(day, inputDay) {
    var textMonth = '';

    for (var i = 0; i < listMonth.length; i++) {
      if (isDate(inputDay) && day.getFullYear() === inputDay.getFullYear() && inputDay.getMonth() === i) {
        textMonth += '<span class="month active">' + listMonth[i] + '</span>';
      } else {
        textMonth += '<span class="month">' + listMonth[i] + '</span>';
      }
    }

    return '<div class="datepicker-months" style="display: block;">' +
      '<table class="table-condensed">' +
      '<thead>' +
      '<tr>' +
      '<th class="prev" style="visibility: visible;">«</th>' +
      '<th colspan="5" class="datepicker-switch">' + day.getFullYear() + '</th>' +
      '<th class="next" style="visibility: visible;">»</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td colspan="7">' +
      textMonth +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      createTFoot() +
      '</table>' +
      '</div>';
  };

  var createYearTag = function(year, inputDay) {
    var yearList = '',
      startYear = parseInt(year / 10) * 10,
      endYear = startYear + 9;

    yearList += '<span class="year old">' + (startYear - 1) + '</span>';
    
    for (var i = startYear; i <= endYear; i++) {
      if (isDate(inputDay) && i === inputDay.getFullYear()) {
        yearList += '<span class="year active">' + i + '</span>';
      } else {
        yearList += '<span class="year">' + i + '</span>';
      }
    }
    yearList += '<span class="year new">' + (endYear + 1) + '</span>';

    return '<div class="datepicker-years" style="display: block;">' +
      '<table class="table-condensed">' +
      '<thead>' +
      '<tr>' +
      '<th class="prev" style="visibility: visible;">«</th>' +
      '<th colspan="5" class="datepicker-switch">' + startYear + '-' + endYear + '</th>' +
      '<th class="next" style="visibility: visible;">»</th>' +
      '</tr>' +
      '</thead>' +
      '<tbody>' +
      '<tr>' +
      '<td colspan="7">' +
      yearList +
      '</td>' +
      '</tr>' +
      '</tbody>' +
      createTFoot() +
      '</table>' +
      '</div>';
  };

  var switchDayClickHandler = function(e) {
    var switchTag = $(this),
      year = switchTag.text().split(' ')[1],
      inputTag = switchTag.closest('.datepicker').prev();

    switchTag.closest('.datepicker-days').replaceWith(createMonthTag(new Date(year), parseDay(inputTag.val())));
  };

  var switchMonthClickHandler = function(e) {
    var switchTag = $(this),
      inputTag = switchTag.closest('.datepicker').prev(),
      year = parseInt(switchTag.text());

    switchTag.closest('.datepicker-months').replaceWith(createYearTag(year, parseDay(inputTag.val())));
  };

  var prevDayClickHandler = function(e) {
    var prevTag = $(this),
      time = prevTag.next().text().split(' '),
      dayTag = prevTag.closest('.datepicker-days'),
      inputTag = dayTag.parent().prev(),
      monthIndex = getIndexByMonth(time[0]),
      year = parseInt(time[1]);

    dayTag.replaceWith(createDayTag(new Date(year, monthIndex, 0), parseDay(inputTag.val())));
  };

  var nextDayClickHandler = function(e) {
    var nextTag = $(this),
      time = nextTag.prev().text().split(' '),
      dayTag = nextTag.closest('.datepicker-days'),
      inputTag = dayTag.parent().prev(),
      monthIndex = getIndexByMonth(time[0]),
      year = parseInt(time[1]);

    dayTag.replaceWith(createDayTag(new Date(year, monthIndex + 1, 1), parseDay(inputTag.val())));
  };

  var monthTagNavigate = function(year) {
    var monthTag = this.closest('.datepicker-months'),
      inputTag = monthTag.closest('.datepicker').prev();

    monthTag.replaceWith(createMonthTag(new Date(year.toString()), parseDay(inputTag.val())));
  };

  var prevMonthClickHandler = function(e) {
    var switchTag = $(this).next(),
      year = parseInt(switchTag.text()) - 1;
    monthTagNavigate.call(switchTag, year);
  };

  var nextMonthClickHandler = function(e) {
    var switchTag = $(this).prev(),
      year = parseInt(switchTag.text()) + 1;
    monthTagNavigate.call(switchTag, year);
  };

  var yearTagNavigate = function(year) {
    var yearTag = this.closest('.datepicker-years'),
      inputTag = yearTag.closest('.datepicker').prev();

    yearTag.replaceWith(createYearTag(year, parseDay(inputTag.val())));
  };

  var prevYearClickHandler = function(e) {
    var switchTag = $(this).next(),
      year = parseInt(switchTag.text().split('-')[0]) - 1;

    yearTagNavigate.call(switchTag, year);
  };

  var nextYearClickHandler = function(e) {
    var switchTag = $(this).prev(),
      year = parseInt(switchTag.text().split('-')[1]) + 1;

    yearTagNavigate.call(switchTag, year);
  };

  var parseDay = function(inputText) {
    var inDay, inMonth, inYear, inDayMonthYear, day;

    if (typeof inputText === 'string' && inputText) {
      inDayMonthYear = inputText.split('/');
      switch (format) {
        case 'm/d/y':
          inDay = parseInt(inDayMonthYear[1]);
          inMonth = getIndexByMonth(inDayMonthYear[0]);
          inYear = parseInt(inDayMonthYear[2]);
          break;
        case 'd/m/y':
          inDay = parseInt(inDayMonthYear[0]);
          inMonth = getIndexByMonth(inDayMonthYear[1]);
          inYear = parseInt(inDayMonthYear[2]);
          break;
        case 'y/d/m':
          inDay = parseInt(inDayMonthYear[1]);
          inMonth = getIndexByMonth(inDayMonthYear[2]);
          inYear = parseInt(inDayMonthYear[0]);
          break;
        default:
          inDay = parseInt(inDayMonthYear[1]);
          inMonth = getIndexByMonth(inDayMonthYear[0]);
          inYear = parseInt(inDayMonthYear[2]);
      }
    }
    day = new Date(inYear, inMonth, inDay);
    if (isDate(day)) {
      return day;
    } else {
      return new Date();
    }
  };

  var inputClickHandler = function(e) {
    var day = null,
      inputTag = $(this),
      inputText = inputTag.val(),
      calendar;

    if (inputTag.next().length > 0) {
      inputTag.next().remove();
    }
    day = parseDay(inputText);
    calendar = '<div class="datepicker datepicker-dropdown dropdown-menu datepicker-orient-left datepicker-orient-bottom" style="display: block;">' +
      createDayTag(day, day) +
      '</div>';
    inputTag.after(calendar);
  };

  var highlightDay = function() {
    var tag = $(this);
    tag.closest('tbody').find('.active').removeClass('active');
    tag.addClass('active');
  };

  var setDay = function(year, month, day) {
    switch (format) {
      case 'm/d/y':
        this.val(month + '/' + day + '/' + year);
        break;
      case 'd/m/y':
        this.val(day + '/' + month + '/' + year);
        break;
      case 'y/d/m':
        this.val(year + '/' + day + '/' + month);
        break;
      default:
        this.val(month + '/' + day + '/' + year);
    }
  };


  var clickSetDay = function() {
    var tag = $(this),
      inputTag = tag.closest('.datepicker').prev(),
      month_year = tag.closest('.datepicker-days').find('.datepicker-switch').text().split(' '),
      month = month_year[0],
      year = month_year[1],
      day = tag.text();

    setDay.call(inputTag, year, month, day);
  };

  var dayWithSelectorClick = function(selector) {
    var dayTag = $(this).closest('.datepicker-days'),
      inputTag = dayTag.parent().prev(),
      month_year = dayTag.find('.datepicker-switch').text().split(' '),
      month = getIndexByMonth(month_year[0]),
      year = parseInt(month_year[1]),
      el = dayTag.parent().parent(),
      day = $(this).text();

    switch (selector) {
      case '.new':
        dayTag.replaceWith(createDayTag(new Date(year, month + 1, 1)));
        break;
      case '.old':
        dayTag.replaceWith(createDayTag(new Date(year, month, 0)));
        break;
      default:
        dayTag.replaceWith(createDayTag(new Date(year, month, 0)));
    }

    el.find('.day:not(' + selector + ')').filter(function() {
      return new RegExp('\\b' + day + '\\b', 'g').test($(this).text());
    }).trigger('click');
  };

  var currentDayClick = function() {
    clickSetDay.call(this);
    highlightDay.call(this);
  };

  var dayProcessing = function() {
    var dayTag = $(this);
    if (dayTag.hasClass('new')) {
      dayWithSelectorClick.call(this, '.new');
    } else {
      if (dayTag.hasClass('old')) {
        dayWithSelectorClick.call(this, '.old');
      } else {
        currentDayClick.call(this);
      }
    }
  };

  var dayClickHandler = function(e) {
    dayProcessing.call(this);
  };

  var monthClickHandler = function(e) {
    var span = $(this),
      monthTag = span.closest('.datepicker-months'),
      year = parseInt(monthTag.find('.datepicker-switch').text()),
      month = getIndexByMonth(span.text()),
      inputTag = monthTag.parent().prev();

    monthTag.replaceWith(createDayTag(new Date(year, month), parseDay(inputTag.val())));
  };

  var yearClickHandler = function(e) {
    var span = $(this),
      yearTag = span.closest('.datepicker-years'),
      inputTag = yearTag.parent().prev();

    yearTag.replaceWith(createMonthTag(new Date(span.text()), parseDay(inputTag.val())));
  };

  var divClickHander = function(e) {
    $(this).children('input').focus();
  };

  var clearInput = function() {
    $(this).closest('.datepicker').prev().val('');
  };

  var clearButtonClickHandler = function(e) {
    clearInput.call(this);
  };

  var toDaySetDay = function() {
    var tag = $(this),
      inputTag = tag.closest('.datepicker').prev(),
      toDay = new Date();
    setDay.call(inputTag, toDay.getFullYear(), getMonthByIndex(toDay.getMonth()), toDay.getDate());
  };

  var toDayButtonClickHandler = function(e) {
    toDaySetDay.call(this);
    $(this).closest('div').replaceWith(createDayTag(new Date(), new Date()));
  };

  var inputKeydownHandler = function(e) {
    var key = e.which,
      inputTag = $(this),
      ENTER = 13,
      ESCAPE = 27;

    switch (key) {
      case ENTER:
        if (inputTag.next().length > 0) {
          inputTag.next().remove();
        } else {
          inputTag.trigger('click');
        }
        break;
      case ESCAPE:
        inputTag.next().remove();
        break;
    }
  };

  var inputChangeHandler = function(e) {
    setTimeout(function() {
      $(this).trigger('click');
    }, 300);
  };

  var windowClickHandler = function(e) {
    if ($(':focus').attr('id') !== 'date-input') {
      e.data.element.children('div').remove();
    }
  };

  function Plugin(element, options) {
    this.element = $(element);
    this.options = $.extend({}, $.fn[pluginName].defaults, this.element.data(), options);
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var that = this,
        el = this.element,
        options = this.options;

      format = options.format;
      todayButton = options.todayButton;
      clearButton = options.clearButton;

      el.on('click', divClickHander);
      el.on('click', 'input', inputClickHandler);

      el.on('click', '.datepicker-days .datepicker-switch', switchDayClickHandler);
      el.on('click', '.datepicker-days .prev', prevDayClickHandler);
      el.on('click', '.datepicker-days .next', nextDayClickHandler);

      el.on('click', '.datepicker-months .datepicker-switch', switchMonthClickHandler);
      el.on('click', '.datepicker-months .prev', prevMonthClickHandler);
      el.on('click', '.datepicker-months .next', nextMonthClickHandler);

      el.on('click', '.datepicker-years .prev', prevYearClickHandler);
      el.on('click', '.datepicker-years .next', nextYearClickHandler);

      el.on('click', '.day', dayClickHandler);

      el.on('click', '.month', monthClickHandler);

      el.on('click', '.year', yearClickHandler);

      el.on('click', '.today', toDayButtonClickHandler);

      el.on('click', '.clear', clearButtonClickHandler);

      el.on('keydown', 'input', inputKeydownHandler);

      el.on('input', '#date-input', inputChangeHandler);

      $(window).on('click', {
        element: el
      }, windowClickHandler);
    },
    getDate: function(params) {
      if (typeof params === 'function') {
        params(this.element.children('input').val());
      } else {
        return this.element.children('input').val();
      }
    },
    destroy: function() {
      $.removeData(this.element[0], pluginName);
      $(window).off('click', windowClickHandler);
    }
  };

  $.fn[pluginName] = function(options, params) {
    return this.each(function() {
      var instance = $.data(this, pluginName);
      if (!instance) {
        $.data(this, pluginName, new Plugin(this, options));
      } else if (instance[options]) {
        instance[options](params);
      } else {
        window.console && console.log(options ? options + ' method is not exists in ' + pluginName : pluginName + ' plugin has been initialized');
      }
    });
  };

  $.fn[pluginName].defaults = {
    format: 'd/m/y',
    todayButton: true,
    clearButton: true
  };

  $(function() {
    $('[data-' + pluginName + ']')[pluginName]({});
  });
}(jQuery, window));
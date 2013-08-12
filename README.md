cal126
======

Yet another JavaScript calendar.

### UI
  ```
  var cal = new Cal126UI({
      'name': 'Test calendar', 
      'date': new Date(1988,11,30), 
      'parent':'ranges_list', // element id
      'callback': function(dates){ console.log(dates); },
      'range': true
  });
  ```

### No UI

var month = new Date(2000, 0, 31);
var cal = new Cal126(month);
var calendar = cal.split_by_weeks()

calendar
```
[
    0: 0,     1: 0,     2: 0,    3: 0,    4: 0,    5: 0,    6: 1,    
    0: 2,     1: 3,     2: 4,    3: 5,    4: 6,    5: 7,    6: 8,    
    0: 9,     1: 10,    2: 11,   3: 12,   4: 13,   5: 14,   6: 15,    
    0: 16,    1: 17,    2: 18,   3: 19,   4: 20,   5: 21,   6: 22,    
    0: 23,    1: 24,    2: 25,   3: 26,   4: 27,   5: 28,   6: 29,    
    0: 30,    1: 31,    2: 0,    3: 0,    4: 0,    5: 0,    6: 0, 
]
```

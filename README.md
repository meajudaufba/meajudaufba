# Alumni

## How to use

```
USERNAME=YOUR_USERNAME PASSWORD=YOUR_PASSWORD node server.js
```

## Available Disciplines *
*Not yet implemented.

The json objects from available subjects are formatted as followed:

```json
"ADM001" : {
	"subjectName" : "Introdução à Administração",
	"class": {
		"040000": {
			"availableEnrollment": "10",
			"classTime": {
				"SEG": {
					"startingTime": "10:40",
					"endingTime": "12:30",
					"professorName": "Marcos Gilberto dos Santos"
				},
				"QUA": {
					"startingTime": "10:40",
					"endingTime": "12:30",
					"professorName": "Marcos Gilberto dos Santos"
				}
			}
		}
	}
}
```
## Todos

- Verify response on login method to certify the user is indeed logged (right credentials).
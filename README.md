# TODO: place a pic here
## Temporary website
[http://dummypic.onrender.com/1080/720](http://dummypic.onrender.com/1080/720)
![DummyPic Example](http://dummypic.onrender.com/2920/70)

## Usage

`/width/height/?color=HEXHEX&text=hello`


### UrlEncoded Params
if you have the chance it could be best to use [URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams) to encode complex inputs.
| selector | Description |
| :-----: |  ----- |
| `random` | `true` or `false` br>coming soon|
| `cached` | `true` or `false` <br>coming soon|
| `color` | chose colors in hex format without `#`|
| `gradient` | coming soon |
| `text` | coming soon |
| `textcolor` | coming soon |
| `textgradient` | coming soon |


# Collaborate and engage
Steps to start collaborate
## Assumptions
It's assumed you have already installed Docker. It's not mandatory but its best if you have the opportunity to test your changes.
## Steps
1. clone this repo
2. in a linux environment run `bash startdev.sh`.   This will start up a new container with node and nodemon the project.
3. when you are finished: run `bash enddev.sh`

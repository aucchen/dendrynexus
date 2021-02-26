" Vim syntax file
" Language: Dendry scenes
" Maintainer: Autumn Chen
" Latest Revision: 23 Feb 2021

if exists("b:current_syntax")
  finish
endif

syn match todo 'TODO'

syn match scene_id '^@\w*$'
syn match link_line '^-\s*[@#]\w*' contains=link_id
syn match link_id contained '@\w*'
syn match link_id contained '#\w*'

syn match if_statement contained 'if' nextgroup=colon skipwhite
syn match plaintext contained '[a-zA-Z0-9.?,]*'
syn match colon contained ':' nextgroup=plaintext skipwhite

syn match scene_title contained ' .*$'
syn match boolean contained '[tT]rue'
syn match boolean contained '[fF]alse'
syn match command '^title: .*$' contains=scene_title
syn match command '^subtitle: .*$' contains=scene_title
syn match command '^unavailable-subtitle: .*$' contains=scene_title
syn match command '^new-page: .*$' contains=boolean
syn match command '^is-special: .*$' contains=boolean
syn match command '^view-if:'
syn match command '^choose-if:'
syn match command '^on-arrival:' nextgroup=jsBrackets,jsRegion skipwhite
syn match command '^go-to:'
syn match command '^tags:'
syn match command '^max-visits:'
syn match command '^max-choices:'
syn match command '^priority:'
syn match command '^set-bg:'
syn match command '^set-jump:'


syn match comment '^#.*$'

syn match var_name contained '\w*'
syn match var_replace '\[+\s*\w*\s*+\]' contains=var_name

syn region conditional matchgroup=brackets start='\[?' end='?\]' contains=colon,if_statement,plaintext

syn include @js syntax/javascript.vim
syn include @html syntax/html.vim
syn region jsRegion matchgroup=jsBrackets start='{!' end='!}' fold transparent contains=@js
syn region htmlRegion matchgroup=htmlBrackets start='{!' end='!}' fold transparent contains=@html

hi def link scene_id        Identifier
hi def link scene_title     None
hi def link command         Statement
hi def link boolean         Boolean
hi def link comment         Comment
hi def link link_id         Identifier
hi def link var_name        Identifier
hi def link var_replace     Statement

hi def link brackets        Statement
hi def link if_statement    Statement
hi def link colon           Statement

hi def link jsBrackets      Statement
hi def link htmlBrackets    Statement


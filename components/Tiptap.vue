<template>
    <div>
<div v-if="editor">
 
        <div class="my-1 flex flex-row space-x-1">

        <button @click="editor.chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }" class="h-6 w-6 hover:w-6 group">
            <Icon name="material-symbols:format-bold" class="h-6 w-6 hover:bg-gray-200 rounded-md"
                :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('bold'), 'text-gray-600': !editor.isActive('bold')  }">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1">Bold</span>
        </button>
 
   
        <button @click="editor.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }" class="h-6 w-6 hover:w-6 group">
            <Icon name="material-symbols:format-italic" class="h-6 w-6 hover:bg-gray-200 rounded-md"
                :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('italic'), 'text-gray-600': !editor.isActive('italic')  }">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">Italic</span>
        </button>
 

        <button @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }" class="h-6 w-6 hover:w-6 group">
            <Icon name="material-symbols:format-underlined" class="h-6 w-6 hover:bg-gray-200 rounded-md"
                :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('underline'), 'text-gray-600': !editor.isActive('underline')  }">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">Underline</span>
        </button>
    <div class="border-l border-gray-400 h-5"> </div>

   
        <button @click="editor.chain().focus().toggleBulletList().run()" class=" w-6 hover:w-6 group"
            :class="{ 'is-active': editor.isActive('bulletList') }">
            <Icon name="material-symbols:format-list-bulleted" class="h-6 w-6 hover:bg-gray-200 rounded-md"
                :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('bulletList'), 'text-gray-600': !editor.isActive('bulletList')  }">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">BulletList</span>
        </button>
        <button  @click="editor.chain().focus().toggleOrderedList().run()" class=" w-6 hover:w-6 group"
            :class="{ 'is-active': editor.isActive('orderedList') }">
            <Icon name="material-symbols:format-list-numbered" class="h-6 w-6 hover:bg-gray-200 rounded-md"
                :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('orderedList'), 'text-gray-600': !editor.isActive('orderedList')  }">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">NumberedList</span>
        </button>
        <button @click="editor.chain().focus().sinkListItem('listItem').run()" class=" w-6 hover:w-6 group"
            >
            <Icon name="material-symbols:format-indent-increase" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">IncreaseIndent</span>
        </button>
        <button @click="editor.chain().focus().liftListItem('listItem').run()" class=" w-6 hover:w-6 group"
            >
            <Icon name="material-symbols:format-indent-decrease" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600"
                >
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">DecreaseIndent</span>
        </button>


    <div class="border-l border-gray-400 h-5"> </div>

    <button @click="editor.chain().focus().toggleSuperscript().run()" class=" w-6 hover:w-6 group"
        :class="{ 'is-active': editor.isActive('superscript') }">
        <Icon name="lucide:superscript" class="h-6 w-6 hover:bg-gray-200 rounded-md"
            :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('superscript'), 'text-gray-600': !editor.isActive('superscript')  }">
        </Icon>
        <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">Superscript</span>
    </button>
 
    <button @click="editor.chain().focus().toggleSubscript().run()" class=" w-6 hover:w-6 group"
        :class="{ 'is-active': editor.isActive('subscript') }">
        <Icon name="lucide:subscript" class="h-6 w-6 hover:bg-gray-200 rounded-md"
            :class="{ 'text-primary  bg-gray-200 border shadow-sm ': editor.isActive('subscript'), 'text-gray-600': !editor.isActive('subscript')  }">
        </Icon>
        <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">Superscript</span>
    </button>

    <div class="border-l border-gray-400 h-5"> </div>
    
    <button @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
    class=" w-6 hover:w-6 group">
        <Icon name="mdi:table" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
        </Icon>
        <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">InsertTable</span>
    </button>
<div v-if="editor.can().addColumnAfter()">

<button @click="editor.chain().focus().deleteTable().run()" :disabled="!editor.can().deleteTable()"
    class=" w-6 hover:w-6 group">
    <Icon name="mdi:table-remove" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
    </Icon>
    <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">DeleteTable</span>
</button>
        <button @click="editor.chain().focus().addColumnBefore().run()" :disabled="!editor.can().addColumnBefore()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-column-plus-before" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">AddColumnLeft</span>
        </button>
       
        <button @click="editor.chain().focus().addColumnAfter().run()" :disabled="!editor.can().addColumnAfter()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-column-plus-after" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">AddColumnRight</span>
        </button>
        <button @click="editor.chain().focus().deleteColumn().run()" :disabled="!editor.can().deleteColumn()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-column-remove" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">DeleteColumn</span>
        </button>
        <button @click="editor.chain().focus().addRowBefore().run()" :disabled="!editor.can().addRowBefore()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-row-plus-before" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">AddRowAbove</span>
        </button>
    <button @click="editor.chain().focus().addRowAfter().run()" :disabled="!editor.can().addRowAfter()"
        class=" w-6 hover:w-6 group">
        <Icon name="mdi:table-row-plus-after" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
        </Icon>
        <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">AddRowBelow</span>
    </button>
    <button @click="editor.chain().focus().deleteRow().run()" :disabled="!editor.can().deleteRow()"
        class=" w-6 hover:w-6 group">
        <Icon name="mdi:table-row-remove" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
        </Icon>
        <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">DeleteRow</span>
    </button>
     
        <button @click="editor.chain().focus().mergeCells().run()" :disabled="!editor.can().mergeCells()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-merge-cells" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">MergeCells</span>
        </button>
        <button @click="editor.chain().focus().splitCell().run()" :disabled="!editor.can().splitCell()"
            class=" w-6 hover:w-6 group">
            <Icon name="mdi:table-split-cell" class="h-6 w-6 hover:bg-gray-200 rounded-md text-gray-600">
            </Icon>
            <span class="invisible group-hover:visible bg-gray-600 text-white p-1 ">SplitCell</span>
        </button>

</div>



      
        </div>
        </div>



<div class="w-7/12"> 

    <editor-content :editor="editor"/>
</div>

</div>

</template>

<script>
import { Editor, EditorContent, BubbleMenu, FloatingMenu, } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Superscript from '@tiptap/extension-superscript'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import TableRow from '@tiptap/extension-table-row'
import TableHeader from '@tiptap/extension-table-header'
import TableCell from '@tiptap/extension-table-cell'
import Table from '@tiptap/extension-table'
import Image from '@tiptap/extension-image'



export default {
    components: {
        EditorContent,
        BubbleMenu
    },
    props: {
        modelValue: {
            type: String,
            default: '',
        },
    },


    emits: ['update:modelValue'],

    data() {
        return {
            editor: null,
            show: false
        }
    },

    watch: {
        modelValue(value) {
            // HTML
            const isSame = this.editor.getHTML() === value

            // JSON
            // const isSame = JSON.stringify(this.editor.getJSON()) === JSON.stringify(value)

            if (isSame) {
                return
            }

            this.editor.commands.setContent(value, false)
        },
    },

    mounted() {
        this.editor = new Editor({
            extensions: [
                StarterKit,
                Superscript,
                Subscript,
                Underline,
                OrderedList,
                ListItem,
                TableCell,
                TableHeader,
                TableRow,
                Table.configure({
                    resizable: true,
                }),
                Image.configure({
                    allowBase64: true,
                }),
                
            ],
            editorProps: {
                attributes: {
                    class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl rounded-md outline outline-1 outline-gray-400 ',
                },
            },
            content: this.modelValue,
            onUpdate: () => {
                // HTML
                this.$emit('update:modelValue', this.editor.getHTML())

                // JSON
                // this.$emit('update:modelValue', this.editor.getJSON())
            },
        })
    },

    beforeUnmount() {
        this.editor.destroy()
    },
}
</script>
<style lang="scss">
/* Basic editor styles */
.ProseMirror {
     min-height: 80px;
     padding: 1rem;
    >*+* {
        margin-top: 0.75em;
    }

    ul,
    ol {
        padding: 0 1rem;
    }

    blockquote {
        padding-left: 1rem;
        border-left: 2px solid rgba(#0D0D0D, 0.1);
    }
}

.bubble-menu {
    display: flex;
    background-color: #0D0D0D;
    padding: 0.2rem;
    border-radius: 0.5rem;

    button {
        border: none;
        background: none;
        color: #FFF;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0 0.2rem;
        opacity: 0.6;

        &:hover,
        &.is-active {
            opacity: 1;
        }
    }
}

.floating-menu {
    display: flex;
    background-color: #0D0D0D10;
    padding: 0.2rem;
    border-radius: 0.5rem;

    button {
        border: none;
        background: none;
        font-size: 0.85rem;
        font-weight: 500;
        padding: 0 0.2rem;
        opacity: 0.6;

        &:hover,
        &.is-active {
            opacity: 1;
        }
    }
}
.ProseMirror {
    table {
        border-collapse: collapse;
        table-layout: fixed;
        width: 100%;
        margin: 0;
        overflow: hidden;

        td,
        th {
            min-width: 1em;
            border: 2px solid #ced4da;
            padding: 3px 5px;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;

            >* {
                margin-bottom: 0;
            }
        }

        th {
            font-weight: bold;
            text-align: left;
            background-color: #f1f3f5;
        }

        .selectedCell:after {
            z-index: 2;
            position: absolute;
            content: "";
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(200, 200, 255, 0.4);
            pointer-events: none;
        }

        .column-resize-handle {
            position: absolute;
            right: -2px;
            top: 0;
            bottom: -2px;
            width: 4px;
            background-color: #adf;
            pointer-events: none;
        }

        p {
            margin: 0;
        }
    }
}

.tableWrapper {
    overflow-x: auto;
}

.resize-cursor {
    cursor: ew-resize;
    cursor: col-resize;
}
</style>
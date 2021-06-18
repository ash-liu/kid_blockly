 import Blockly from 'blockly';

 export default {
   
 }
 Blockly.Themes.pico = Blockly.Theme.defineTheme('pico', {
  'base': Blockly.Themes.Classic,
  'categoryStyles': {
    'chip_category': {
      'colour': 10
    },
    // 'logic_category': {
    //   'colour': "#45d391",
    // },
    // 'loops_category': {
    //   'colour': "#cd00ff",
    // },
    // 'variable_category': {
    //   'colour': "#88b500",
    // },
    // 'math_category': {
    //   'colour': "#bda600",
    // },
    // 'text_category': {
    //   'colour': "#d34573",
    // },
    // 'list_category': {
    //   'colour': "#ff6c37",
    // },
    // 'function_category': {
    //   'colour': "#ce3905",
    // },
    'sensor_category': {
      'colour': "#2cb1f8",
    },
    'actor_category': {
      'colour': "#005cb9",
    },
    'voice_category': {
      'colour': "#a8baf8",
    }
  },
  'blockStyles': {
    'chip_blocks': {
      'colourPrimary': 10
    },
    // 'logic_blocks': {
    //   'colourPrimary': "#45d391",
    // },
    // 'loop_blocks': {
    //   "colourPrimary": "#cd00ff"
    // },
    // 'variable_blocks': {
    //   'colourPrimary': "#88b500",
    // },
    // 'math_blocks': {
    //   'colourPrimary': "#bda600",
    // },
    // 'text_blocks': {
    //   'colourPrimary': "#d34573",
    // },
    // 'list_blocks': {
    //   'colourPrimary': "#ff6c37",
    // },
    // 'function_blocks': {
    //   'colourPrimary': "#ce3905",
    // },
    'sensor_blocks': {
      'colourPrimary': "#2cb1f8",
    },
    'actor_blocks': {
      'colourPrimary': "#005cb9",
    },
    'voice_blocks': {
      'colourPrimary': "#a8baf8",
    }
  }
});
/* Stoichiometry Table Widget for LabArchives eNotebook

Bryan Andrews and Joshua Wesalo (University of Pittsburgh) forked the code from the original developed
by the Sydney Informatics Hub from an initial version by Dr. Samuel Banister.
This work was completed to build a customized widget for the Deiters Lab (http://deiterslab.org).
This work was supported by the US National Institutes of Health (R01GM112728).

The original code was implemented by Joel Nothman and Vijay Raghunath at the Sydney Informatics Hub.
Please acknowledge our contribution to your work where appropriate:
"This research was supported by the Sydney Informatics Hub, funded by the University of Sydney."
Copyright (c) 2018-2020, The University of Sydney
All rights reserved.


Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors
may be used to endorse or promote products derived from this software without
specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

my_widget_script =
    {
      init:function (mode, json_data) {
        //this method is called when the form is being constructed
        // parameters
        // mode = if it equals 'view' than it should not be editable
        //        if it equals 'edit' then it will be used for entry
        //        if it equals 'view_dev' same as view,  does some additional checks that may slow things down in production
        //        if it equals 'edit_dev' same as edit,   does some additional checks that may slow things down in production

        // json_data will contain the data to populate the form with, it will be in the form of the data
        // returned from a call to to_json or empty if this is a new form.
        //By default it calls the parent_class's init.
        
    if (mode == "edit" || mode == "edit_dev") {
      $(".widgetcredit").show();
    } else {
      $(".widgetcredit").hide();
    }

        // Precision for floats
        var nFixed = 2;

        this.parent_class.init(mode, json_data);
        
        document.getElementById("initialfixed").checked = false


        moles1 = $('#the_form input[name=moles1]');
        fw1 = $('#the_form input[name=fw1]');
        if (moles1.val() && fw1.val()) {
          my_widget_script.enable_all_records()
        }

        if (mode.indexOf('view') > -1) {
          var isEmpty = function(tr) {
            var inputs = $('input', tr);
            for (var i = 0; i < inputs.length; i++) {
              if ($(inputs[i]).val()) {
                return false;
              }
            }
            return true;
          }

          $('#the_form tbody tr').each(function() {
            if (isEmpty(this)) {
              $(this).remove();
            }
          })
          return;
        }

        /* Clear button */
        $('#the_form tr:not(.initialRow) input').on('focus', function() {
          $(this).closest("tr").append($('<td id="clearcur"></td>').append(
            $("<a href='#' title='Clear data for this row'>").text("Ⓧ").mousedown(function() {
              $("input", $(this).closest("tr")).each(function() { $(this).val(""); });
            })
          ))
        }).on('blur', function() {
          $("#clearcur").remove();
        });

        /* Other interaction */
        $('#the_form input.amount').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.is_initial_row) {
            if (ctx.fw.val() && !ctx.moles.val()) {
              ctx.moles.val((ctx.amount.val() / ctx.fw.val()).toFixed(nFixed))
              my_widget_script.enable_all_records()
            } else if (ctx.fw.val() && ctx.amount.val() && ctx.moles.val()) {
              ctx.moles.val((ctx.amount.val() / ctx.fw.val()).toFixed(nFixed))
              if (document.getElementById("initialfixed").checked) {
                my_widget_script.update_all_records_equiv()
              } else {
                my_widget_script.update_all_records()
              }
              my_widget_script.enable_all_records()
            }
          } else {
            if (ctx.fw.val()) {
              ctx.moles.val((ctx.amount.val() / ctx.fw.val()).toFixed(nFixed));
              ctx.equiv.val((ctx.amount.val() / ctx.fw.val() / ctx.moles1.val()).toFixed(nFixed))
            } else if (ctx.moles.val()) {
              ctx.fw.val((ctx.amount.val() / ctx.moles.val()).toFixed(nFixed));
            }
          }
          my_widget_script.update_volume(ctx);
        });

        $('#the_form input.fw').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.is_initial_row) {
            if (ctx.amount.val() && ctx.moles.val()) {
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              my_widget_script.enable_all_records()
              my_widget_script.update_volume(ctx);
            } else if (ctx.amount.val()) {
              ctx.moles.val((ctx.amount.val() / ctx.fw.val()).toFixed(nFixed))
              my_widget_script.enable_all_records()
            } else if (ctx.moles.val()) {
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              my_widget_script.enable_all_records()
              my_widget_script.update_volume(ctx);
            }
          } else {
            if (ctx.amount.val() && !ctx.equiv.val()) {
              ctx.moles.val((ctx.amount.val() / ctx.fw.val()).toFixed(nFixed))
              ctx.equiv.val((ctx.amount.val() / ctx.fw.val() / ctx.moles1.val()).toFixed(nFixed))
            } else if (ctx.equiv.val()) {
              ctx.moles.val((ctx.moles1.val() * ctx.equiv.val()).toFixed(nFixed));
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              my_widget_script.update_volume(ctx);
            }
          }
        });

        $('#the_form input.moles').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.is_initial_row) {
            if (ctx.fw.val() && !ctx.amount.val()) {
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              my_widget_script.enable_all_records()
              my_widget_script.update_volume(ctx);
            } else if (ctx.fw.val() && ctx.amount.val() && ctx.moles.val()) {
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              if (document.getElementById("initialfixed").checked) {
                my_widget_script.update_all_records_equiv()
              } else {
                my_widget_script.update_all_records()
              }
              my_widget_script.enable_all_records()
              my_widget_script.update_volume(ctx);
            }
          } else {
            if (ctx.moles1.val()) {
              ctx.equiv.val((ctx.moles.val() / ctx.moles1.val()).toFixed(nFixed))
            }
            if (ctx.fw.val()) {
              ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
              my_widget_script.update_volume(ctx);
            }
            if (ctx.amount.val()) {
              ctx.fw.val((ctx.amount.val() / ctx.moles.val()).toFixed(nFixed));
            }
          }
        });

        $('#the_form input.equivalents').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          /* if fw, equiv exists, calculate amt and moles when they are not filled for rows greater than 1 or
             Re-calculate amt and moles when equiv value is changed for rows greater than 1 */
          if (ctx.fw.val()) {
            ctx.moles.val((ctx.moles1.val() * ctx.equiv.val()).toFixed(nFixed));
            ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(nFixed))
            my_widget_script.update_volume(ctx);
          }

          // If not first row, then calculate ctx.moles if moles_1 field is there
          if (!ctx.is_initial_row) {
            if (ctx.moles1.val()) {
              ctx.moles.val((ctx.moles1.val() * ctx.equiv.val()).toFixed(nFixed));
            }
          }
        });

        $('#the_form input.density').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          my_widget_script.update_volume(ctx);
          if (ctx.volume.val() && !ctx.amount.val()) {
            ctx.amount.val((ctx.volume.val() * ctx.density.val()).toFixed(2));
            ctx.amount.change();
          }
        });

        $('#the_form input.volume').on('change', function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.density.val() && !ctx.amount.val()) {
            ctx.amount.val((ctx.volume.val() * ctx.density.val()).toFixed(2));
            ctx.amount.change();
          }
        });
      },

      get_context:function (target) {
        var tr = $(target).closest('tr');
        return {
          fw: $(".fw", tr),
          equiv: $(".equivalents", tr),
          amount: $(".amount", tr),
          moles: $(".moles", tr),
          density: $(".density", tr),
          volume: $(".volume", tr),
          moles1: $('#the_form input.moles[name=moles1]'),
          is_initial_row: tr.attr('class') == 'initialRow'
        };
      },

      to_json:function () {
        //should return a json string containing the data entered into the form by the user
        //whatever is return from the method is persisted in LabArchives.  must not be binary data.
        //called when the user hits the save button, when adding or editing an entry


        //TO DO write code specific to your form
        return this.parent_class.to_json();
      },

      from_json:function (json_data) {
        //populates the form with json_data
        //TO DO write code specific to your form
        this.parent_class.from_json(json_data);
      },

      test_data:function () {
        //during development this method is called to populate your form while in preview mode
        //TO DO write code specific to your form
        return this.parent_class.test_data();
      },

      is_valid:function (b_suppress_message) {
        //called when the user hits the save button, to allow for form validation.
        //returns an array of dom elements that are not valid - default is those elements marked as mandatory
        // that have no data in them.
        //You can modify this method, to highlight bad form elements etc...
        //LA calls this method with b_suppress_message and relies on your code to communicate issues to the user
        //Returning an empty array [] or NULL equals no error
        //TO DO write code specific to your form
        return this.parent_class.is_valid(b_suppress_message);
      },

      is_edited:function () {
        //should return true if the form has been edited since it was loaded or since reset_edited was called
        return this.parent_class.is_edited();
      },

      reset_edited:function () {
        //typically called have a save
        //TO DO write code specific to your form
        return this.parent_class.reset_edited();
      },

      // Enable all records if the first record fields are correctly filled
      enable_all_records: function() {
        $('#the_form tbody tr:not(.initialRow) input').prop('disabled', false)
      },

      update_volume: function(ctx) {
        if (!(ctx.density.val() && ctx.amount.val()))
          return;
        ctx.volume.val((ctx.amount.val() / ctx.density.val()).toFixed(2));
      },

      // Change all record when amount or moles of first record is changed
      update_all_records: function() {
        $('#the_form tbody tr:not(.initialRow)').each(function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.fw.val() && ctx.equiv.val()) {
            ctx.moles.val((ctx.moles1.val() * ctx.equiv.val()).toFixed(2));
            ctx.amount.val((ctx.moles.val() * ctx.fw.val()).toFixed(2))
            my_widget_script.update_volume(ctx);
          }
        })
      },

      // Change all record equiv when amount or moles of first record is changed
      update_all_records_equiv: function() {
        $('#the_form tbody tr:not(.initialRow)').each(function() {
          var ctx = my_widget_script.get_context(this);
          if (ctx.fw.val() && ctx.equiv.val()) {
            ctx.equiv.val((ctx.moles.val() / ctx.moles1.val()).toFixed(2))
            my_widget_script.update_volume(ctx);
          }
        })
      },


      

      // next.equiv = (next.amount/next.fw) / (first.amount/first.fw)

    }

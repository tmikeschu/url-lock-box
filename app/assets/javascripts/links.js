$(document).ready(() => {
  new LinksManager()
})

class LinksManager {
  constructor() {
    $("input[value='Lock It Up']").on("click", this.lockItUp.bind(this))
    $("body").on("click", "input[value='Mark as Read']", this.markAsRead.bind(this))
    $("body").on("click", "input[value='Mark as Unread']", this.markAsUnread.bind(this))
  }

  lockItUp(event) {
    event.preventDefault()

    const url = $("#link_url:valid").val()
    const title = $("#link_title:valid").val()
    const link = { link: { url: url, title: title } }
    
    url && title ? this.createLink(link) : this.handleErrors()
  }

  createLink(link) {
    $.ajax({
      url: "api/v1/links",
      method: "POST",
      data: link
    })
    .done(response => {
      $("#link_url, #link_title").val("")
      $(".lockbox").prepend(response)
      $(".create-link #link_url, #link_title").val("")
    })
    .fail(error => console.log(error))
  }

  handleErrors() {
    $(".create-link p").text("")
    const urlMsg = $("#link_url")[0].validationMessage
    const titleMsg = $("#link_title")[0].validationMessage

    urlMsg && $("#link_url").after(`<p class="flash danger">${urlMsg}</p>`)
    titleMsg && $("#link_title").after(`<p class="flash danger">${titleMsg}</p>`)
  }
  
  markAsUnread(event) {
    event.preventDefault();

    const linkId = $(event.target).siblings("#link_id").val()
    const link = { link: { read: false } }

    this.updateReadStatus(link, linkId)
  }

  markAsRead(event) {
    event.preventDefault();

    const linkId = $(event.target).siblings("#link_id").val()
    const link = { link: { read: true } }

    this.updateReadStatus(link, linkId)
  }

  updateReadStatus(link, linkId) {
    $.ajax({
      type: "PATCH",
      url: "/api/v1/links/" + linkId,
      data: link,
    })
    .done(this.updateLinkStatus)
    .fail(this.displayFailure);
  }

  updateLinkStatus(link) {
    const buttonText = link.read ? "Mark as Unread" : "Mark as Read"
    $(`#link${link.id}`).find('p').text(`Read? ${link.read}`)
    $(`#link${link.id}`).find('.read-unread').val(buttonText)
  }

  displayFailure(failureData){
    console.log("FAILED attempt to update Link: " + failureData.responseText);
  }
}


